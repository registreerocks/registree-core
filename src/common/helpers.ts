/**
 * General-purpose helper code.
 */

/**
 * Check that a value is not `undefined`.
 *
 * @param x
 * @param message Error message to throw.
 * @throws TypeError If `x` is undefined
 */
export function assertDefined<T>(x: T | undefined, message?: string): T {
  if (x === undefined) {
    throw new TypeError(message ?? 'assertDefined: undefined');
  } else {
    return x;
  }
}
