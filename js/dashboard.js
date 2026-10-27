/* Dashboard-only motion: daily digest border shine and the BMR gauge moving to its new score. */
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

  /* ---------- BMR gauge: animate from the previous score to the current one ---------- */

  const gauge = document.querySelector('[data-gauge]');
  if (!gauge) return;

  const DEG_PER_POINT = 30; // 270° dial across scores 1–10
  const CAP = 6; // extra degrees so the arc's rounded end sits under the marker
  const from = Number(gauge.dataset.from);
  const to = Number(gauge.dataset.to);
  const value = gauge.querySelector('.gauge__value');
  const chip = gauge.querySelector('.gauge__chip');

  function render(score) {
    gauge.style.setProperty('--turn', (score - to) * DEG_PER_POINT + 'deg');
    gauge.style.setProperty('--sweep', (score - 1) * DEG_PER_POINT + CAP + 'deg');
  }

  if (reduceMotion || !firstVisit('opl.gaugeIntro')) {
    render(to);
    return;
  }

  render(from);
  value.textContent = from;

  const DELAY = 900;
  const DURATION = 1400;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let start = null;
  let done = false;

  function frame(now) {
    if (done) return;
    if (start === null) start = now;
    const t = Math.min((now - start) / DURATION, 1);
    render(from + (to - from) * ease(t));
    if (t > 0.55 && value.textContent !== String(to)) {
      value.textContent = to;
      value.classList.add('is-pop');
      chip.classList.add('is-pop');
    }
    if (t < 1) requestAnimationFrame(frame);
    else finish();
  }
  function finish() {
    done = true;
    render(to);
    gauge.style.removeProperty('--sweep');
    value.textContent = to;
  }
  setTimeout(() => requestAnimationFrame(frame), DELAY);

  // If frames never run (tab in the background, headless capture), still land on the real score.
  setTimeout(() => done || finish(), DELAY + DURATION + 600);
})();
