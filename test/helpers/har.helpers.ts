/**
 * Helpers for working with HAR data.
 */

import { Entry, Request, Response, Header } from 'har-format';

/**
 * Construct a HAR {@link Entry} with reasonable defaults.
 *
 * @see http://www.softwareishard.com/blog/har-12-spec/#entries
 */
export function makeEntry(request: Request, response: Response): Entry {
  return {
    startedDateTime: '',
    time: 0,
    request: request,
    response: response,
    cache: {},
    timings: {
      wait: 0,
      receive: 0,
    },
  };
}

/**
 * Construct a HAR `POST` {@link Request} with reasonable defaults.
 *
 * @param args.url Full request URL
 * @param args.json Value to serialise to JSON as the `POST` data
 *
 * @see http://www.softwareishard.com/blog/har-12-spec/#request
 */
export function makeRequestPOST(args: {
  url: string;
  headers?: Map<string, string>;
  json: unknown;
}): Request {
  function toHeader([name, value]: [string, string]): Header {
    return { name, value };
  }
  const headers: Header[] =
    args.headers !== undefined
      ? Array.from(args.headers.entries(), toHeader)
      : [];

  const body = JSON.stringify(args.json);
  return {
    method: 'POST',
    url: args.url,
    httpVersion: 'HTTP/1.1',
    cookies: [],
    headers: headers,
    queryString: [],
    headersSize: -1,
    bodySize: body.length,
    postData: {
      mimeType: 'application/json',
      text: body,
    },
  };
}

/**
 * Construct a HAR `200 OK` {@link Response} with reasonable defaults.
 *
 * @param args.json Value to serialise to JSON as the response content
 *
 * @see http://www.softwareishard.com/blog/har-12-spec/#response
 */
export function makeResponseOK(args: { json: unknown }): Response {
  const body = JSON.stringify(args.json);
  return {
    status: 200,
    statusText: 'OK',
    httpVersion: 'HTTyP/1.1',
    cookies: [],
    headers: [],
    content: {
      size: body.length,
      mimeType: 'application/json',
      text: body,
    },
    redirectURL: '',
    headersSize: -1,
    bodySize: body.length,
  };
}
