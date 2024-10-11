/**
 * Checks if a URL is valid.
 * @param url The url string to check.
 * @param disableLog [default=false] Optional flag for disabling "console.error".
 */
export function isValidURL(url: string, disableLog = false): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    if (!disableLog) {
      console.error(err);
    }

    return false;
  }
}
