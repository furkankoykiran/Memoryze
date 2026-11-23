#!/usr/bin/env node

/**
 * Verify the deployable output after `vite build`. Fails the build when the
 * document metadata, discovery files or hashed assets are missing, so a broken
 * bundle never reaches GitHub Pages.
 */

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve('dist');
const read = (file) => fs.readFile(resolve(DIST, file), 'utf8');
const exists = (file) =>
  fs
    .access(resolve(DIST, file))
    .then(() => true)
    .catch(() => false);

async function main() {
  const html = await read('index.html');
  const problems = [];

  if (!html.includes('<html lang="en">')) problems.push('document language must be English');
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push('title is missing');
  if (!/name="description"[\s\S]{0,120}content="[^"]{50,}"/.test(html)) {
    problems.push('meta description is missing');
  }
  if (!html.includes('rel="canonical" href="https://furkankoykiran.com.tr/Memoryze/"')) {
    problems.push('canonical URL is missing or wrong');
  }
  if (!html.includes('property="og:image" content="https://furkankoykiran.com.tr/Memoryze/og-image.png"')) {
    problems.push('Open Graph image is missing or not absolute');
  }
  if (!html.includes('application/ld+json')) problems.push('JSON-LD is missing');
  if (!html.includes('WebApplication')) problems.push('WebApplication schema is missing');
  if (!html.includes('/Memoryze/assets/')) problems.push('asset URLs do not use the /Memoryze/ base path');

  const required = [
    '404.html',
    '.nojekyll',
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'ai.txt',
    'manifest.webmanifest',
    '.well-known/security.txt',
    'favicon-64.png',
    'og-image.png',
  ];
  const checks = await Promise.all(required.map(exists));
  required.forEach((file, index) => {
    if (!checks[index]) problems.push(`dist/${file} is missing`);
  });

  const asset = html.match(/src="\/Memoryze\/assets\/[^"]+\.js"/);
  if (!asset) {
    problems.push('no hashed JavaScript entry found in dist/index.html');
  } else {
    const path = asset[0].match(/assets\/[^"]+\.js/)[0];
    if (!(await exists(path))) problems.push(`referenced asset does not exist: ${path}`);
  }

  if (problems.length > 0) {
    throw new Error(`Build verification failed:\n- ${problems.join('\n- ')}`);
  }

  console.log('Verified dist: metadata, discovery files and hashed assets are present.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
