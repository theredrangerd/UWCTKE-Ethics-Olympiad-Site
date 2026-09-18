function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * @param {Array<{src: string, alt: string}>} images
 * @returns {string}
 */
export function renderGalleryHTML(images) {
  if (!images || images.length === 0) {
    return `<p class="gallery-placeholder">Photos from the competition will appear here soon.</p>`;
  }

  const items = images
    .map(
      (img) => `<img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy">`
    )
    .join('');

  return `<div class="gallery-grid">${items}</div>`;
}
