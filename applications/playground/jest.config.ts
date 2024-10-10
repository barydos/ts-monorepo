import type { Config } from 'jest';

import baseConfig from '../../jest.config';

const config: Config = {
  ...baseConfig,
  rootDir: './',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  coveragePathIgnorePatterns: ['index.ts'],
};

export default config;
