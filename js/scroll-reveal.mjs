// js/scroll-reveal.mjs
// Progressive-enhancement reveal: elements are visible by default in CSS
// ([data-reveal] { opacity: 1 }). This only adds a transitioned entrance
// when JS + IntersectionObserver are available; if either is unavailable,
// or the observer never fires, content stays visible.
export function initScrollReveal(selector = '[data-reveal]') {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  items.forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const revealAll = () => {
    items.forEach((el) => el.classList.add('reveal-visible'));
    observer.disconnect();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));

  // Safety net: never let content stay hidden indefinitely.
  setTimeout(revealAll, 1800);
}
