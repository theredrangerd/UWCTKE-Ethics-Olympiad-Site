// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';
import { renderResultsHTML } from './results-render.mjs';
import { getStageState } from './funnel-state.mjs';
import { Config } from './config.mjs';

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

function nowISO() {
  return new Date().toISOString();
}

function initRegistrationCTA() {
  const cta = document.getElementById('registration-cta');
  if (!cta) return;

  const state = getStageState(nowISO(), Config.REGISTRATION_OPEN, Config.REGISTRATION_CLOSE);
  const formUrlReady = !Config.REGISTRATION_FORM_URL.startsWith('REPLACE_WITH');

  if (state === 'before') {
    cta.textContent = 'Registration opens 6 Oct 2026';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else if (state === 'after') {
    cta.textContent = 'Registration closed';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else if (!formUrlReady) {
    cta.textContent = 'Registration link coming soon';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else {
    cta.textContent = 'Register your team';
    cta.href = Config.REGISTRATION_FORM_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
  }
}

initGallery();
initResults();
initRegistrationCTA();
