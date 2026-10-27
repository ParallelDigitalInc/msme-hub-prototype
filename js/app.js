/* Shared behaviour for every MSME Hub screen: menus, sidebar groups, rotating AI questions. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Popover menus (language, support, messages) ---------- */

  const menus = [...document.querySelectorAll('[data-menu]')];

  function setOpen(menu, open) {
    menu.classList.toggle('is-open', open);
    menu.querySelector(':scope > button').setAttribute('aria-expanded', String(open));
  }
  function closeAll(except) {
    menus.forEach((m) => m !== except && setOpen(m, false));
  }

  menus.forEach((menu) => {
    menu.querySelector(':scope > button').addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !menu.classList.contains('is-open');
      closeAll(menu);
      setOpen(menu, open);
    });
    menu.querySelector('.pop').addEventListener('click', (e) => e.stopPropagation());
  });
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = menus.find((m) => m.classList.contains('is-open'));
    if (open) {
      setOpen(open, false);
      open.querySelector(':scope > button').focus();
    }
  });

  // Language: mark the choice and update the pill. (Copy isn't translated in the prototype.)
  document.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', () => {
      const menu = item.closest('[data-menu]');
      menu.querySelectorAll('[data-lang]').forEach((i) => i.setAttribute('aria-checked', String(i === item)));
      menu.querySelector('[data-lang-label]').textContent = item.dataset.code;
      menu.querySelector(':scope > button').setAttribute('aria-label', 'Language: ' + item.querySelector('small').textContent);
      document.documentElement.lang = item.dataset.lang;
      setOpen(menu, false);
    });
  });

  // Support: "Request a callback" turns into a confirmation.
  document.querySelectorAll('[data-callback]').forEach((btn) => {
    btn.addEventListener('click', () => btn.closest('.pop').querySelector('.support').classList.add('is-requested'));
  });

  // ⌘K / Ctrl+K focuses search
  const search = document.querySelector('.search input');
  document.addEventListener('keydown', (e) => {
    if (search && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      search.focus();
    }
  });

  /* ---------- Collapsible sidebar groups ---------- */

  document.querySelectorAll('[data-collapsible]').forEach((group) => {
    const head = group.querySelector('.nav-group__head');
    head.addEventListener('click', () => {
      const collapsed = group.classList.toggle('is-collapsed');
      head.setAttribute('aria-expanded', String(!collapsed));
    });
  });

  /* ---------- Rotating AI questions ---------- */

  const ROTATE_EVERY = 5200; // ms each question stays up
  const STAGGER = 1700; // ms between prompts, so they never change together

  document.querySelectorAll('[data-questions]').forEach((prompt, index) => {
    if (reduceMotion) return;
    const questions = prompt.dataset.questions.split('|');
    const text = prompt.querySelector('.ai-prompt__text');
    const orb = prompt.querySelector('.orb');
    let i = 0;
    let paused = false;

    prompt.addEventListener('mouseenter', () => (paused = true));
    prompt.addEventListener('mouseleave', () => (paused = false));
    prompt.addEventListener('focus', () => (paused = true));
    prompt.addEventListener('blur', () => (paused = false));

    function next() {
      if (paused || document.hidden) return;
      i = (i + 1) % questions.length;
      text.classList.add('is-out');
      orb.classList.remove('is-thinking');
      void orb.offsetWidth; // restart the pulse
      orb.classList.add('is-thinking');
      setTimeout(() => {
        text.textContent = questions[i];
        text.classList.remove('is-out');
        text.classList.add('is-in');
        void text.offsetWidth;
        text.classList.remove('is-in');
      }, 260);
    }

    setTimeout(() => setInterval(next, ROTATE_EVERY), 2400 + index * STAGGER);
  });
})();
