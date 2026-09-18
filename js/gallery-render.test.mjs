import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderGalleryHTML } from './gallery-render.mjs';

test('renders a "coming soon" placeholder when images is empty', () => {
  const html = renderGalleryHTML([]);
  assert.match(html, /Photos from the competition will appear here soon/);
});

test('renders an img tag per image when populated', () => {
  const html = renderGalleryHTML([
    { src: 'assets/gallery/round1.jpg', alt: 'Round 1 teams presenting' },
  ]);
  assert.match(html, /<img[^>]*src="assets\/gallery\/round1\.jpg"/);
  assert.match(html, /alt="Round 1 teams presenting"/);
});
