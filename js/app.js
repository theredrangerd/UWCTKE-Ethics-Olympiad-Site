// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';
import { renderResultsHTML } from './results-render.mjs';

async function initGallery() {
  const root = document.getElementById('gallery-root');
  if (!root) return;

  try {
    const res = await fetch('assets/gallery/manifest.json');
    const images = await res.json();
    root.innerHTML = renderGalleryHTML(images);
  } catch (err) {
    root.innerHTML = renderGalleryHTML([]);
  }
}

async function initResults() {
  const root = document.getElementById('results-root');
  if (!root) return;

  try {
    const res = await fetch('data/results.json');
    const results = await res.json();
    root.innerHTML = renderResultsHTML(results);
  } catch (err) {
    root.innerHTML = renderResultsHTML([]);
  }
}

initGallery();
initResults();
