/**
 * Helpers for redacting sensitive data from HTTP recordings.
 */

import { Header } from 'har-format';

/**
 * Redact secret values from a string.
 *
 * @param sensitiveString
 * @param redactions Pairs of `[secret, redacted]` to replace in `sensitiveString`
 */
export function redactString(
  sensitiveString: string,
  redactions: Iterable<[string, string]>,
): string {
  let redactedString = sensitiveString;
  for (const [secret, redacted] of redactions) {
    redactedString = redactedString.replace(secret, redacted);
  }
  return redactedString;
}

/**
 * Redact a HAR header value (modifying it in-place).
 *
 * @param headers The headers of a request or response.
 * @param name Name of the header to redact.
 * @param redact Called with the header's value, to redact it.
 */
export function redactHeaderInPlace(
  headers: Header[],
  name: string,
  redact: (value: string) => string,
): void {
  const found = headers.filter(
    h => h.name.toLowerCase() === name.toLowerCase(),
  );
  if (found.length === 0) {
    throw new Error(`redactHeaderInPlace: missing header: ${name}`);
  } else if (found.length == 1) {
    const [header] = found;
    header.value = redact(header.value);
  } else {
    const nameRepr = JSON.stringify(name);
    throw new Error(
      [
        `redactHeaderInPlace: multiple instances of header ${nameRepr}:`,
        ...found.map(h => JSON.stringify(h)),
      ].join('\n'),
    );
  }
}

/**
 * Redact a top-level key from a JSON-encoded string.
 */
export function redactJSONStringKey(
  sensitiveJSON: string,
  sensitiveKey: string,
  redactedValue: unknown, // Any JSON value
): string {
  const sensitiveObject: unknown = JSON.parse(sensitiveJSON);
  if (
    !(
      typeof sensitiveObject === 'object' &&
      sensitiveObject !== null &&
      !Array.isArray(sensitiveObject)
    )
  ) {
    throw new TypeError(
      `redactJSONStringKey: expected JSON object, got: ${sensitiveJSON}`,
    );
  } else if (sensitiveObject[sensitiveKey] === undefined) {
    throw new Error(
      `redactJSONStringKey: object missing expected key: ${sensitiveKey}`,
    );
  } else {
    const redactedObject = {
      ...sensitiveObject,
      [sensitiveKey]: redactedValue,
    };
    return JSON.stringify(redactedObject);
  }
}

/**
 * Redactable URL parts.
 */
export type URLParts = Partial<
  Pick<
    URL,
    | 'protocol'
    | 'username'
    | 'password'
    | 'hostname'
    | 'port'
    | 'pathname'
    | 'search'
    | 'hash'
  >
>;

/**
 * Redact parts of a URL.
 */
export function redactURL(s: string, parts: URLParts): string {
  return Object.assign(new URL(s), parts).toString();
}
