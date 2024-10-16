#!/usr/bin/env node

import { app } from './app/app';

(async function handler() {
  try {
    await app();
  } catch (err) {
    console.error('Something went wrong!');
    console.error(err);
  }
})();
