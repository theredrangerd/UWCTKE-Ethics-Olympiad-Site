// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';

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

initGallery();
