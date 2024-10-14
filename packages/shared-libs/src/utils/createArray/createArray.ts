/**
 * Creates an array of specified size.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createArray<T extends any[], U>(
  size: number,
  callback?: (...args: T) => U,
  ...args: T
) {
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // const newArray = [...Array(size).keys()];
  const newArray = Array.from({ length: size }, (_, index) => index);

  if (!callback) {
    return newArray as unknown as U[]; // Handle callback case
  }

  return newArray.map(() => callback(...args));
}
