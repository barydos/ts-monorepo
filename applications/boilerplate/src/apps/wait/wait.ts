import { delay } from '@barydos/shared-libs';

export async function wait() {
  const timeout = 5_000;

  console.log(`-- Waiting ${timeout / 1_000} seconds..`);
  await delay(timeout);
}
