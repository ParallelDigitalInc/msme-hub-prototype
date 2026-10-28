/* Dashboard-only motion: the daily digest border shine and the scrollable business cards. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The brief asks for this on a user's first landing. Set to true to play it once per
  // browser session; it's off so every reload shows it during reviews.
  const FIRST_VISIT_ONLY = false;

  function firstVisit(key) {
    if (!FIRST_VISIT_ONLY) return true;
    try {
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, '1');
    } catch (e) {}
    return true;
  }

  /* ---------- Daily digest shine ---------- */

  const digest = document.querySelector('[data-shine]');
  if (digest && !reduceMotion && firstVisit('opl.digestShine')) {
    digest.classList.add('is-shining');
    digest.addEventListener('animationend', (e) => e.target === digest && digest.classList.remove('is-shining'));
  }

  /* ---------- Scrollable card rows: fade the edge only while there's more to see ---------- */

  document.querySelectorAll('[data-scroll-fade]').forEach((row) => {
    const update = () => {
      row.classList.toggle('is-scrollable', row.scrollWidth > row.clientWidth + 1);
      row.classList.toggle('is-at-end', row.scrollLeft + row.clientWidth >= row.scrollWidth - 2);
    };
    row.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(row);
    update();
  });
})();
