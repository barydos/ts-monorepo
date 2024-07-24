/**
 * Delay by a specified timeout (milliseconds).
 */
export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
