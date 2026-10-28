/* Score gauge shared by the dashboard (BMR) and Loans (CMR): the dial animates from data-from to data-to. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DEG_PER_POINT = 30; // 270° dial across scores 1–10
  const CAP = 6; // extra degrees so the arc's rounded end sits under the marker
  const BASE = 3; // the marker artwork was exported with the dial at 3
  const DELAY = 900;
  const DURATION = 1400;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  document.querySelectorAll('[data-gauge]').forEach((gauge) => {
    const from = Number(gauge.dataset.from);
    const to = Number(gauge.dataset.to);
    const value = gauge.querySelector('.gauge__value');
    const chip = gauge.querySelector('.gauge__chip');

    function render(score) {
      gauge.style.setProperty('--turn', (score - BASE) * DEG_PER_POINT + 'deg');
      gauge.style.setProperty('--sweep', (score - 1) * DEG_PER_POINT + CAP + 'deg');
    }

    if (reduceMotion || from === to) {
      render(to);
      return;
    }

    render(from);
    value.textContent = from;

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
  });
})();
