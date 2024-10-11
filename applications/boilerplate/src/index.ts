import { wait } from './apps';

(async function handler() {
  try {
    await wait();

    console.log('');
    console.log('-- Complete!');
  } catch (err) {
    console.error('Unexpected error encountered!');
    console.error(err);
  }
})();
