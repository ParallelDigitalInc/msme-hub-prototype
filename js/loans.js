/* Loans-only behaviour: section tabs, filter chips, compare checkboxes and the borrowing bar's intro. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Section tabs (only Overview has content in the prototype) ---------- */

  const tabs = [...document.querySelectorAll('.tab')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    });
  });

  /* ---------- Filter chips: one of the quick filters is on at a time ---------- */

  const chips = [...document.querySelectorAll('.fchip[data-filter]')];
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.toggle('is-on', c === chip));
    });
  });

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
