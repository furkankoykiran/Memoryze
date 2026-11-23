#!/usr/bin/env node

/**
 * Finish the GitHub Pages artifact: GitHub Pages serves 404.html for unknown
 * paths, so it must be the same hashed bundle as index.html for client-side
 * routes to work. .nojekyll keeps Jekyll from touching the files.
 */

import { copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DIST = resolve('dist');

async function main() {
  await copyFile(resolve(DIST, 'index.html'), resolve(DIST, '404.html'));
  await writeFile(resolve(DIST, '.nojekyll'), '');
  console.log('Wrote dist/404.html and dist/.nojekyll.');
}

main().catch((error) => {
  console.error(`Post-build failed: ${error.message}`);
  process.exitCode = 1;
});
