import fc from 'fast-check';
import { Header } from 'har-format';
import {
  hostMatches,
  redactHeaderInPlace,
  redactHostSet,
  redactJSONStringKey,
  redactString,
  redactURL,
  URLParts,
} from './redaction.helpers';

describe('redactString', () => {
  test('identity: redact secrets with their own value', () => {
    const identityRedactions: fc.Arbitrary<[string, string][]> = fc
      .array(fc.unicodeString())
      .map(a => a.map(s => [s, s]));

    fc.assert(
      fc.property(fc.unicodeString(), identityRedactions, (s, redactions) => {
        expect(redactString(s, redactions)).toStrictEqual(s);
      }),
    );
  });

  test('redact substrings of "secret" to "redacted"', () => {
    const stringWithoutSecret: fc.Arbitrary<string> = fc
      .unicodeString()
      .filter(s => !s.includes('secret'));

    fc.assert(
      fc.property(fc.array(stringWithoutSecret), strings => {
        // Intersperse a sequence of arbitrary strings with "secretN",
        // to be redacted with "redactedN" (where N is an enumeration).
        const sensitiveString = strings
          .map((s, i) => `${s}secret${i}`)
          .join('');
        const redactedString = strings
          .map((s, i) => `${s}redacted${i}`)
          .join('');

        const redactions = new Map<string, string>(
          Array.from({ length: strings.length }, (_, i) => [
            `secret${i}`,
            `redacted${i}`,
          ]),
        );

        expect(redactString(sensitiveString, redactions)).toStrictEqual(
          redactedString,
        );
      }),
    );
  });
});

describe('redactHeaderInPlace', () => {
  // Arbitrary header:
  const arbHeader: fc.Arbitrary<Header> = fc.record({
    name: fc.string(),
    value: fc.string(),
  });

  // Arbitrary headers, along with a uniquely-named header chosen from them,
  // and mixed-case variations of its name:
  const headersWithChosen: fc.Arbitrary<[Header[], Header, string]> = fc
    .array(arbHeader, { minLength: 1 })
    .chain((headers: Header[]) =>
      fc
        .constantFrom(...headers)
        // Add mixed-case name variations:
        .chain((chosen: Header) =>
          fc
            .mixedCase(fc.constantFrom(chosen.name))
            .map((name): [Header[], Header, string] => [headers, chosen, name]),
        ),
    )
    // Make sure the chosen header's name is unique:
    .filter(([headers, chosen, _name]) =>
      headers.every(
        (h: Header) =>
          h.name.toLowerCase() !== chosen.name.toLowerCase() ||
          Object.is(h, chosen),
      ),
    );

  test('identity: redact header with existing value', () => {
    fc.assert(
      fc.property(headersWithChosen, ([headers, _header, name]) => {
        const snapshot = copy(headers);
        redactHeaderInPlace(headers, name, value => value);
        expect(headers).toStrictEqual(snapshot);
      }),
    );
  });

  test('redact header with a different value', () => {
    fc.assert(
      fc.property(
        headersWithChosen,
        fc.string(),
        ([headers, header, name], redactedValue) => {
          // Simulate the expected redaction on `headers` using `header`,
          // and take snapshots before and after that.
          const inputHeaders = copy(headers);
          header.value = redactedValue;
          const redactedHeaders = copy(headers);

          redactHeaderInPlace(inputHeaders, name, _value => redactedValue);
          expect(inputHeaders).toStrictEqual(redactedHeaders);
        },
      ),
    );
  });

  test('reject missing header', () => {
    // Arbitrary headers, along with a header name that's missing from them:
    const headersMissingName: fc.Arbitrary<[
      Header[],
      string,
    ]> = fc.string().chain((missingName: string) => {
      const namesNotMissing: fc.Arbitrary<string> = fc
        .string()
        .filter(name => name.toLowerCase() !== missingName.toLowerCase());

      return fc
        .array(fc.record({ name: namesNotMissing, value: fc.string() }))
        .map((headers: Header[]) => [headers, missingName]);
    });

    fc.assert(
      fc.property(headersMissingName, ([headers, missingName]) => {
        const snapshot = copy(headers);

        expect(() =>
          redactHeaderInPlace(headers, missingName, value => {
            throw new Error(`unexpected call with value: ${value}`);
          }),
        ).toThrowError(`redactHeaderInPlace: missing header: ${missingName}`);

        expect(headers).toStrictEqual(snapshot); // should remain unchanged
      }),
    );
  });

  test('reject multiple matching headers', () => {
    const headersWithMultiples: fc.Arbitrary<[
      Header[],
      string,
    ]> = fc.string().chain((baseName: string) =>
      fc
        .tuple(
          fc.array(fc.mixedCase(fc.constant(baseName)), { minLength: 1 }),
          fc.array(fc.string()),
        )
        .map(([duplicates, extras]) => [baseName, ...duplicates, ...extras])
        .chain(names => fc.shuffledSubarray(names, { minLength: names.length }))
        .chain(names =>
          fc.genericTuple(
            names.map(
              (name): fc.Arbitrary<Header> =>
                fc.record({ name: fc.constant(name), value: fc.string() }),
            ),
          ),
        )
        .map((headers: Header[]) => [headers, baseName]),
    );

    fc.assert(
      fc.property(headersWithMultiples, ([headers, duplicateName]) => {
        const snapshot = copy(headers);

        expect(() =>
          redactHeaderInPlace(headers, duplicateName, value => {
            throw new Error(`unexpected call with value: ${value}`);
          }),
        ).toThrowError(`redactHeaderInPlace: multiple instances of header`);

        expect(headers).toStrictEqual(snapshot); // should remain unchanged
      }),
    );
  });
});

describe('redactJSONStringKey', () => {
  type JSONObject = Record<keyof never, unknown>;
  function isJSONObject(o): o is JSONObject {
    return typeof o === 'object' && o !== null && !Array.isArray(o);
  }
  // Arbitrary JSON objects (not primitives or arrays)
  const objectsOnly: fc.Arbitrary<JSONObject> = fc
    .unicodeJsonObject()
    // XXX(Pi): Why is type inference failing here?
    .filter(o => isJSONObject(o)) as fc.Arbitrary<JSONObject>;

  test('reject non-object JSON values', () => {
    fc.assert(
      fc.property(
        fc.unicodeJsonObject().filter(o => !isJSONObject(o)),
        o => {
          const json = JSON.stringify(o);
          expect(() =>
            redactJSONStringKey(json, 'unused', 'unused'),
          ).toThrowError(
            `redactJSONStringKey: expected JSON object, got: ${json}`,
          );
        },
      ),
    );
  });

  test('reject missing expected keys', () => {
    fc.assert(
      fc.property(
        objectsOnly,
        fc.unicodeString(),
        fc.unicodeString(),
        (o, key, value) => {
          fc.pre(!(key in o)); // precondition: key not in object

          const json = JSON.stringify(o);
          expect(() => redactJSONStringKey(json, key, value)).toThrowError(
            `redactJSONStringKey: object missing expected key: ${key}`,
          );
        },
      ),
    );
  });

  // Arbitrary JSON objects, along with a key present in them:
  const objectsWithKey: fc.Arbitrary<[JSONObject, string]> = objectsOnly
    // Take objects with at least one key:
    .filter(o => 0 < Object.keys(o).length)
    // Extract a random key:
    .chain(o => fc.constantFrom(...Object.keys(o)).map(k => [o, k]));

  test('identity: redact key with existing value', () => {
    fc.assert(
      fc.property(objectsWithKey, ([o, key]) => {
        const json = JSON.stringify(o);
        const value = o[key];
        expect(redactJSONStringKey(json, key, value)).toStrictEqual(json);
      }),
    );
  });

  test('redact key with a different value', () => {
    fc.property(objectsWithKey, fc.unicodeJsonObject(), ([o, key], value) => {
      const sensitiveJSON = JSON.stringify(o);
      const redactedJSON = JSON.stringify({ ...o, [key]: value });
      expect(redactJSONStringKey(sensitiveJSON, key, value)).toStrictEqual(
        redactedJSON,
      );
    });
  });
});

describe('redactURL', () => {
  type URLPartName = keyof URLParts;
  const urlPartNames: URLPartName[] = [
    'protocol',
    'username',
    'password',
    'hostname',
    'port',
    'pathname',
    'search',
    'hash',
  ];
  const arbPartNames: fc.Arbitrary<URLPartName[]> = fc.subarray(urlPartNames);

  test('identity: redact parts with existing values', () => {
    fc.assert(
      fc.property(normalisedURL(), arbPartNames, (s, partNames) => {
        const url = new URL(s);
        const parts: URLParts = Object.fromEntries(
          partNames.map(name => [name, url[name]]),
        );
        expect(redactURL(s, parts)).toStrictEqual(s);
      }),
    );
  });

  test('redact all parts', () => {
    fc.assert(
      fc.property(normalisedURL(), s => {
        const parts: URLParts = Object.fromEntries(
          urlPartNames.map(name => [
            name,
            // The host must be valid (non-empty), or the assignment gets ignored.
            name === 'hostname'
              ? 'h'
              : // Redact everything else to empty.
                '',
          ]),
        );
        const redacted = redactURL(s, parts);
        const scheme = new URL(s).protocol;
        expect(redacted).toStrictEqual(`${scheme}//h/`);
      }),
    );
  });

  test('redact some parts', () => {
    fc.assert(
      fc.property(normalisedURL(), arbPartNames, (s, partNames) => {
        const parts = Object.fromEntries(
          partNames.map(name => [
            name,
            // Special protocols can't be mixed, so redact to 'https'
            // See: https://nodejs.org/api/url.html#url_url_protocol
            name === 'protocol'
              ? 'https'
              : // The port must be valid, so redact to empty.
              name === 'port'
              ? ''
              : // Redact everything else to 'redacted'.
                'redacted',
          ]),
        );

        const redacted = redactURL(s, parts);

        const redactedURL = new URL(redacted);
        const redactedParts: URLParts = Object.fromEntries(
          urlPartNames.map(name => [name, redactedURL[name]]),
        );
        const expectedParts: URLParts = Object.fromEntries(
          urlPartNames.map(name => [
            name,
            partNames.includes(name)
              ? (({
                  protocol: 'https:',
                  port: '',
                  pathname: '/redacted',
                  search: '?redacted',
                  hash: '#redacted',
                }[name] ?? 'redacted') as string)
              : redactedURL[name],
          ]),
        );
        expect(redactedParts).toStrictEqual(expectedParts);
      }),
    );
  });
});
describe('hostMatches', () => {
  test('same URL matches', () => {
    fc.assert(
      fc.property(normalisedURL(), (url: string) => {
        expect(hostMatches(url, url)).toBe(true);
      }),
    );
  });

  // The scheme and netloc parts of URLs.
  const netlocParts: (keyof URLParts)[] = ['protocol', 'hostname', 'port'];

  test('different URLs mismatch', () => {
    fc.assert(
      fc.property(
        normalisedURL(),
        normalisedURL(),
        (url1: string, url2: string) => {
          // Precondition: URLs don't have the same protocol, host, and port
          const u1 = new URL(url1);
          const u2 = new URL(url2);
          const partsDifferent = !netlocParts.every(
            (part: keyof URLParts) => u1[part] === u2[part],
          );
          fc.pre(partsDifferent);

          expect(hostMatches(url1, url2)).toBe(false);
        },
      ),
    );
  });

  test('related URLs match', (): void => {
    fc.assert(
      fc.property(
        normalisedURL(),
        normalisedURL(),
        fc.context(),
        (url1, url2: string, ctx: fc.ContextValue) => {
          const u1 = new URL(url1);
          const u2 = new URL(url2);
          netlocParts.forEach((part: keyof URLParts) => (u1[part] = u2[part]));
          const modifiedURL = u1.toString();
          ctx.log(`expecting ${modifiedURL} to match with ${url2})`);

          expect(hostMatches(modifiedURL, url2)).toBe(true);
        },
      ),
    );
  });
});

describe('redactHostSet', () => {
  test('identity: no redaction', () => {
    fc.assert(
      fc.property(
        normalisedURL(),
        fc.array(fc.tuple(normalisedURL(), fc.domain())),
        (url: string, hostRedactions: [string, string][]) => {
          // Precondition: none of the hostRedactions match.
          const urlHostname = new URL(url).hostname;
          fc.pre(
            hostRedactions.every(
              ([hostURL, _redactedHost]) =>
                urlHostname !== new URL(hostURL).hostname,
            ),
          );

          expect(redactHostSet(url, hostRedactions)).toBe(url);
        },
      ),
    );
  });

  test('simple redaction', () => {
    fc.assert(
      fc.property(normalisedURL(), (url: string) => {
        const u = new URL(url);
        const matchingHostURL: string = Object.assign(new URL(url), {
          protocol: u.protocol,
          hostname: u.hostname,
          port: u.port,
        } as URLParts).toString();
        const redactedURL: string = Object.assign(new URL(url), {
          protocol: 'https',
          hostname: 'redacted-host',
          port: '',
        } as URLParts).toString();

        expect(redactHostSet(url, [[matchingHostURL, 'redacted-host']])).toBe(
          redactedURL,
        );
      }),
    );
  });
});

/** Test helper: Make a JSON-roundtrip copy of an object. */
function copy<T>(o: T): T {
  const c: unknown = JSON.parse(JSON.stringify(o));
  expect(c).toStrictEqual(o);
  return c as T;
}

/**
 * Like `fc.webUrl`, but enable optional constraints, and normalise the resulting URLs.
 */
function normalisedURL(): fc.Arbitrary<string> {
  return fc
    .webUrl({
      authoritySettings: {
        withIPv4: true,
        withIPv6: true,
        withIPv4Extended: true,
        withUserInfo: true,
        withPort: true,
      },
      withQueryParameters: true,
      withFragments: true,
    })
    .map(s => {
      const url = new URL(s);
      // Avoid dealing with trailing "?" and "#"
      if (url.search === '') url.search = '';
      if (url.hash === '') url.hash = '';
      return url.toString();
    });
}
