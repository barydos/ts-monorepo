// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild');

// CommonJS build
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.cjs.js',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    sourcemap: true,
    external: [], // List dependencies to be treated as external
    tsconfig: './tsconfig.json',
  })
  .catch(() => process.exit(1));

// ESM build
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.mjs',
    bundle: true,
    platform: 'node',
    format: 'esm',
    sourcemap: true,
    external: [], // List dependencies to be treated as external
    tsconfig: './tsconfig.json',
  })
  .catch(() => process.exit(1));
