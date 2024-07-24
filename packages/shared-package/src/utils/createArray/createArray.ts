/**
 * Creates an array of specified size.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createArray(size: number, mapper?: (index: number) => any) {
  const newArray = [...Array(size).keys()];

  if (!mapper) {
    return newArray;
  }

  return newArray.map(mapper);
}
