/* Loans-only behaviour: compare checkboxes and the borrowing bar's intro. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Compare: the card shows it's selected ---------- */

  document.querySelectorAll('.compare input').forEach((box) => {
    box.addEventListener('change', () => box.closest('.offer').classList.toggle('is-compared', box.checked));
  });

  /* ---------- Borrowing bar grows in from the left once the page has settled ---------- */

  const bar = document.querySelector('.sbar');
  if (bar && !reduceMotion) {
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('is-ready')));
  } else if (bar) {
    bar.classList.add('is-ready');
  }
})();
