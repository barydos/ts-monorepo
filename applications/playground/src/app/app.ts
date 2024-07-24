import { delay } from 'shared-package';

export async function handler() {
  try {
    const timeout = 5_000;
    console.log(`-- Waiting ${timeout / 1_000} seconds..`);
    await delay(5_000);

    console.log(`-- Complete!`);
  } catch (err) {
    console.error('Unexpected error encountered!');
    console.error(err);
  }
}
