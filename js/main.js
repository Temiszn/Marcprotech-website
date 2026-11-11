/* ==========================================================================
   1. LOAD PARTIALS (header/footer)
   ========================================================================== */
async function loadPartial(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    const html = await response.text();
    document.getElementById(placeholderId).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

/* ==========================================================================
   2. RUN EVERYTHING AFTER THE PARTIALS ARE IN THE PAGE
   ========================================================================== */
async function initPage() {
  await Promise.all([
    loadPartial('partials/header.html', 'header-placeholder'),
    loadPartial('partials/footer.html', 'footer-placeholder')
  ]);

  setupMobileNav();
  highlightActiveLink();
  setFooterYear();
  setupHeroDecor();
  setupReveal();
  setupHeaderShadow();
  setupCopyButtons();
  setupMarquee();
  setupScrollProgress();
  setupBackToTop();
  setupQuickContact();
  setupCardGlow();
  setupCardFocus();
  setupQuoteWizard();
}

/* ==========================================================================
   3. MOBILE NAV
   ========================================================================== */
function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));

  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ==========================================================================
   4. HIGHLIGHT CURRENT PAGE IN THE NAV
   ========================================================================== */
function highlightActiveLink() {
  const currentPage = document.body.dataset.page;
  const link = document.querySelector(`.nav-links a[data-page="${currentPage}"]`);
  if (link) link.classList.add('active');
}

/* ==========================================================================
   5. FOOTER YEAR
   ========================================================================== */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   6. HERO DECOR: add the floating hexagons to EVERY hero
   Creates the three <span class="hex"> elements in JS, so no page needs
   them written by hand. Skips a hero that already has its own.
   ========================================================================== */
function setupHeroDecor() {
  document.querySelectorAll('.hero, .page-hero').forEach((hero) => {
    if (hero.querySelector('.hex')) return;

    ['hex-a', 'hex-b', 'hex-c'].forEach((cls) => {
      const hex = document.createElement('span');
      hex.className = `hex ${cls}`;
      hex.setAttribute('aria-hidden', 'true');
      hero.prepend(hex);
    });
  });
}

/* ==========================================================================
   7. SCROLL REVEAL (with stagger)
   ========================================================================== */
function setupReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.product-grid, .chips, .contact-cards, .ct-tiles, .faq-list').forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty('--delay', `${(i % 3) * 120}ms`);
    });
  });

  document.querySelectorAll(
    '.product-grid > *, .chips > *, .contact-cards > *, .ct-tiles > *, .faq-list > *, .ct-compose, .section-head, .cta .container'
  ).forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ==========================================================================
   8. HEADER SHADOW ON SCROLL
   ========================================================================== */
function setupHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const update = () => header.classList.toggle('scrolled', window.scrollY > 10);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ==========================================================================
   9. COPY-TO-CLIPBOARD BUTTONS
   ========================================================================== */
function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Copied ✓';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      } catch (error) {
        btn.textContent = btn.dataset.copy;
      }
    });
  });
}

/* ==========================================================================
   10. MARQUEE: duplicate content so the loop has no gap
   ========================================================================== */
function setupMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ==========================================================================
   11. SCROLL PROGRESS BAR
   ========================================================================== */
function setupScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ==========================================================================
   12. BACK-TO-TOP BUTTON
   ========================================================================== */
function setupBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ==========================================================================
   13. QUICK CONTACT: build WhatsApp + email links (and a preview)
   ========================================================================== */
function setupQuickContact() {
  const picker = document.getElementById('topicPicker');
  if (!picker) return; // not the contact page

  const WHATSAPP_NUMBER = '2348067843950'; // international format, no + or spaces
  const EMAIL = 'info@marcprotech.com';

  const labels = {
    quote: 'a quote',
    equipment: 'coding and marking equipment',
    consumables: 'spares and consumables',
    service: 'installation and servicing',
    other: 'your products and services'
  };

  const buttons = picker.querySelectorAll('.topic');
  const waLink = document.getElementById('waLink');
  const mailLink = document.getElementById('mailLink');
  const preview = document.getElementById('msgPreview');

  function select(key) {
    const text = `Hello Marcprotech, I would like to enquire about ${labels[key]}.`;

    waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    mailLink.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(text)}`;
    if (preview) preview.textContent = text;

    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.topic === key);
    });
  }

  picker.addEventListener('click', (event) => {
    const btn = event.target.closest('.topic');
    if (btn) select(btn.dataset.topic);
  });

  const fromUrl = new URLSearchParams(window.location.search).get('topic');
  select(labels[fromUrl] ? fromUrl : 'quote');
}

/* ==========================================================================
   14. CURSOR GLOW ON SERVICE CARDS
   ========================================================================== */
function setupCardGlow() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - box.left}px`);
      card.style.setProperty('--my', `${event.clientY - box.top}px`);
    });
  });
}

/* ==========================================================================
   15. TOUCH / SMALL SCREENS: highlight the card in the middle of the screen
   ========================================================================== */
function setupCardFocus() {
  if (!window.matchMedia('(hover: none), (max-width: 768px)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('in-focus', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  document.querySelectorAll('.service-card').forEach((card) => observer.observe(card));
}

/* ==========================================================================
   16. QUOTE BUILDER (3-step popup)
   `state` holds the visitor's answers, and render() redraws the popup
   for whichever step they are on.
   ========================================================================== */
function setupQuoteWizard() {
  const WHATSAPP_NUMBER = '2348067843950'; // international format, no + or spaces
  const EMAIL = 'info@marcprotech.com';

  const needs = {
    machine:     { title: 'A coding machine',          note: 'CIJ, TIJ or laser' },
    service:     { title: 'Installation or servicing', note: 'Setup, servicing and repairs' },
    consumables: { title: 'Spares & consumables',      note: 'Ink, makeup cartridges, solvent' },
    notsure:     { title: "I'm not sure yet",          note: "We'll help you decide" }
  };
  const surfaces = ['Bottles & cans', 'Cartons & cases', 'Sachets & pouches', 'Cables & pipes', 'Something else'];

  let state = { step: 0, need: null, surface: null, name: '', company: '' };
  let lastFocus = null;

  const modal = document.createElement('div');
  modal.className = 'quote-modal';
  modal.innerHTML = `
    <div class="quote-backdrop" data-close></div>
    <div class="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quoteTitle" tabindex="-1">
      <button class="quote-close" type="button" data-close aria-label="Close">&times;</button>
      <div class="quote-progress"><span id="quoteBar"></span></div>
      <p class="quote-step" id="quoteStep"></p>
      <h2 id="quoteTitle"></h2>
      <div id="quoteContent"></div>
      <button type="button" class="quote-back" id="quoteBack">&larr; Back</button>
    </div>`;
  document.body.appendChild(modal);

  const dialog  = modal.querySelector('.quote-dialog');
  const bar     = modal.querySelector('#quoteBar');
  const stepEl  = modal.querySelector('#quoteStep');
  const titleEl = modal.querySelector('#quoteTitle');
  const content = modal.querySelector('#quoteContent');
  const backBtn = modal.querySelector('#quoteBack');

  function buildMessage() {
    const lines = ["Hello Marcprotech Nigeria Limited, I'd like a quote.", `I need: ${needs[state.need].title}`];
    if (state.surface) lines.push(`Coding on: ${state.surface}`);
    if (state.name)    lines.push(`Name: ${state.name}`);
    if (state.company) lines.push(`Company: ${state.company}`);
    return lines.join('\n');
  }

  function updateLinks() {
    const text = buildMessage();
    content.querySelector('#qWa').href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    content.querySelector('#qMail').href =
      `mailto:${EMAIL}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(text)}`;
  }

  function render() {
    bar.style.width = `${((state.step + 1) / 3) * 100}%`;
    stepEl.textContent = `Step ${state.step + 1} of 3`;
    backBtn.hidden = state.step === 0;

    content.classList.remove('swap');
    void content.offsetWidth;
    content.classList.add('swap');

    if (state.step === 0) {
      titleEl.textContent = 'What do you need?';
      content.innerHTML = Object.entries(needs).map(([key, n]) => `
        <button type="button" class="quote-option" data-need="${key}">
          <strong>${n.title}</strong><span>${n.note}</span>
        </button>`).join('');
    }

    if (state.step === 1) {
      titleEl.textContent = 'What do you print codes on?';
      content.innerHTML = `
        <div class="quote-chips">
          ${surfaces.map((s) => `<button type="button" class="quote-chip" data-surface="${s}">${s}</button>`).join('')}
        </div>
        <button type="button" class="quote-skip" data-skip>Skip this step</button>`;
    }

    if (state.step === 2) {
      titleEl.textContent = 'Almost done';
      content.innerHTML = `
        <div class="quote-summary" id="quoteSummary"></div>
        <div class="quote-field">
          <label for="qName">Your name</label>
          <input id="qName" type="text" autocomplete="name">
        </div>
        <div class="quote-field">
          <label for="qCompany">Company <small>(optional)</small></label>
          <input id="qCompany" type="text" autocomplete="organization">
        </div>
        <div class="quote-send">
          <a id="qWa" class="btn btn-primary" target="_blank" rel="noopener">Send on WhatsApp</a>
          <a id="qMail" class="btn quote-mail">Send by email</a>
        </div>
        <p class="quote-note">Your message is already written. You only press send.</p>`;

      content.querySelector('#quoteSummary').textContent =
        needs[state.need].title + (state.surface ? ` · ${state.surface}` : '');
      content.querySelector('#qName').value = state.name;
      content.querySelector('#qCompany').value = state.company;
      updateLinks();
    }
  }

  function go(step) { state.step = step; render(); }

  function open() {
    state = { step: 0, need: null, surface: null, name: '', company: '' };
    lastFocus = document.activeElement;
    render();
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    setTimeout(() => dialog.focus(), 50);
  }

  function close() {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-quote]');
    if (trigger) {
      event.preventDefault();
      open();
    }
  });

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) return close();

    const need = event.target.closest('[data-need]');
    if (need) { state.need = need.dataset.need; return go(1); }

    const surface = event.target.closest('[data-surface]');
    if (surface) { state.surface = surface.dataset.surface; return go(2); }

    if (event.target.closest('[data-skip]')) { state.surface = null; return go(2); }
    if (event.target.closest('#quoteBack')) go(state.step - 1);
  });

  modal.addEventListener('input', (event) => {
    if (event.target.id === 'qName')    state.name = event.target.value.trim();
    if (event.target.id === 'qCompany') state.company = event.target.value.trim();
    updateLinks();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') return close();
    if (event.key !== 'Tab') return;

    const items = [...dialog.querySelectorAll('button, a[href], input')].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
}

/* ==========================================================================
   START
   ========================================================================== */
document.addEventListener('DOMContentLoaded', initPage);