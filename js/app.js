// js/app.js
import { renderGalleryHTML } from './gallery-render.mjs';
import { renderResultsHTML } from './results-render.mjs';
import { getStageState } from './funnel-state.mjs';
import { validateInterestForm } from './interest-form-validate.mjs';
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

  if (state === 'before') {
    cta.textContent = 'Registration opens 6 Oct 2026';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else if (state === 'after') {
    cta.textContent = 'Registration closed';
    cta.classList.add('btn--disabled');
    cta.removeAttribute('href');
  } else {
    cta.textContent = 'Register your team';
    cta.href = Config.REGISTRATION_FORM_URL;
    cta.target = '_blank';
    cta.rel = 'noopener';
  }
}

function showFieldErrors(errors) {
  document.querySelectorAll('.interest-form__error').forEach((el) => (el.textContent = ''));
  for (const [field, message] of Object.entries(errors)) {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (el) el.textContent = message;
  }
}

function initInterestForm() {
  const form = document.getElementById('interest-form');
  const status = document.getElementById('interest-status');
  const submitBtn = document.getElementById('interest-submit');
  if (!form) return;

  const stage = getStageState(nowISO(), Config.INTEREST_OPEN, Config.INTEREST_CLOSE);
  if (stage === 'before') {
    status.textContent = 'The interest form opens 22 Sept 2026.';
    submitBtn.disabled = true;
    return;
  }
  if (stage === 'after') {
    status.textContent = 'The interest window has closed. Watch for the registration window instead.';
    submitBtn.disabled = true;
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = {
      name: form.name.value,
      email: form.email.value,
      school: form.school.value,
      role: form.role.value,
      website: form.website.value,
    };

    const { valid, errors } = validateInterestForm(fields);
    showFieldErrors(errors);
    if (!valid) return;

    submitBtn.disabled = true;
    status.textContent = 'Submitting…';

    try {
      await fetch(Config.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(fields),
      });
      status.textContent = "Thanks — we'll be in touch.";
      form.reset();
    } catch (err) {
      status.textContent = 'Something went wrong. Please try again or email us directly.';
      submitBtn.disabled = false;
    }
  });
}

initGallery();
initResults();
initRegistrationCTA();
initInterestForm();
