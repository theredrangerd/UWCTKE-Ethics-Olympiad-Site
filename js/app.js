// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';
import { renderResultsHTML } from './results-render.mjs';
import { getStageState } from './funnel-state.mjs';
import { getCountdownParts } from './countdown.mjs';
import { Config } from './config.mjs';
import { initScrollReveal } from './scroll-reveal.mjs';

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

function startInterestCountdown() {
  const root = document.getElementById('eoi-countdown');
  const label = document.getElementById('eoi-countdown-label');
  if (!root) return;

  const fields = {
    days: root.querySelector('[data-countdown="days"]'),
    hours: root.querySelector('[data-countdown="hours"]'),
    minutes: root.querySelector('[data-countdown="minutes"]'),
    seconds: root.querySelector('[data-countdown="seconds"]'),
  };

  root.hidden = false;
  if (label) label.hidden = false;

  const tick = () => {
    // The expression-of-interest form closes the moment registration opens.
    const parts = getCountdownParts(nowISO(), Config.REGISTRATION_OPEN);
    if (parts.expired) {
      clearInterval(intervalId);
      root.hidden = true;
      if (label) label.hidden = true;
      return;
    }
    fields.days.textContent = String(parts.days);
    fields.hours.textContent = String(parts.hours);
    fields.minutes.textContent = String(parts.minutes);
    fields.seconds.textContent = String(parts.seconds);
  };

  tick();
  const intervalId = setInterval(tick, 1000);
}

function initRegistrationCTA() {
  const cta = document.getElementById('registration-cta');
  if (!cta) return;

  const state = getStageState(nowISO(), Config.REGISTRATION_OPEN, Config.REGISTRATION_CLOSE);
  const formUrlReady = !Config.REGISTRATION_FORM_URL.startsWith('REPLACE_WITH');

  if (state === 'before') {
    cta.textContent = 'Registration opens 6 Oct 2026';
    cta.classList.add('btn--pending');
    cta.removeAttribute('href');
    startInterestCountdown();
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
initScrollReveal();
