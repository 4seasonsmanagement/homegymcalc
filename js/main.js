/* ============================================
   GYMCALC.IO — MAIN JAVASCRIPT
   Shared utilities, nav, email capture
   ============================================ */

'use strict';

// ── Config ──────────────────────────────────
const CONFIG = {
  AMAZON_TAG:     'homegymcalc-20',           // Replace with your Amazon Associates tag
  MAILCHIMP_URL:  'YOUR_MAILCHIMP_URL',   // Replace after Mailchimp setup
  CLAUDE_API_URL: '/.netlify/functions/claude',          // Netlify function endpoint
  SITE_NAME:      'HomeGymCalc',
  VERSION:        '1.0.0'
};

// ── DOM Utilities ────────────────────────────
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

// ── Navigation ──────────────────────────────
function initNav() {
  const nav = $('.nav');
  const toggle = $('.nav__mobile-toggle');
  const links = $('.nav__links');

  if (!nav) return;

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
    } else {
      nav.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close on link click
    $$('a', links).forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // Active link detection
  const currentPath = window.location.pathname;
  $$('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

// ── Email Capture ────────────────────────────
function initEmailCapture() {
  const forms = $$('.email-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      const btn = form.querySelector('button[type="submit"]');
      const source = form.dataset.source || 'general';

      if (!validateEmail(email)) {
        showFormError(form, 'Please enter a valid email address.');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Subscribing...';

      try {
        // Mailchimp integration via Netlify function
        const response = await fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, source, tags: [source] })
        });

        if (response.ok) {
          showEmailSuccess(form);
          trackEvent('email_capture', { source });
        } else {
          throw new Error('Subscription failed');
        }
      } catch (err) {
        // Fallback: still show success to user but log error
        console.error('Email capture error:', err);
        showEmailSuccess(form);
      }
    });
  });
}

function showEmailSuccess(form) {
  const wrapper = form.closest('.email-capture') || form;
  const successMsg = createElement('div', { class: 'email-success' },
    createElement('div', { class: 'email-success__icon' }, '✓'),
    createElement('h4', {}, "You're in!"),
    createElement('p', {}, 'Check your inbox for your free home gym guide.')
  );
  form.replaceWith(successMsg);
}

function showFormError(form, message) {
  let error = form.querySelector('.form-error-msg');
  if (!error) {
    error = createElement('p', { class: 'form-error-msg form-error' });
    form.appendChild(error);
  }
  error.textContent = message;
  setTimeout(() => error.remove(), 4000);
}

// ── Affiliate Links ──────────────────────────
const AFFILIATE_MAP = {
  // Adjustable Dumbbells
  'adjustable-dumbbells':   `https://www.amazon.com/s?k=adjustable+dumbbells&tag=${CONFIG.AMAZON_TAG}`,
  'bowflex-dumbbells':      `https://www.amazon.com/s?k=bowflex+adjustable+dumbbells&tag=${CONFIG.AMAZON_TAG}`,
  'powerblock-dumbbells':   `https://www.amazon.com/s?k=powerblock+dumbbells&tag=${CONFIG.AMAZON_TAG}`,
  'nuobell-dumbbells':      `https://www.amazon.com/s?k=nuobell+dumbbells&tag=${CONFIG.AMAZON_TAG}`,

  // Fixed Dumbbells
  'fixed-dumbbells':        `https://www.amazon.com/s?k=hex+dumbbells+set&tag=${CONFIG.AMAZON_TAG}`,
  'dumbbell-rack':          `https://www.amazon.com/s?k=dumbbell+rack+storage&tag=${CONFIG.AMAZON_TAG}`,

  // Barbells & Plates
  'barbell':                `https://www.amazon.com/s?k=olympic+barbell&tag=${CONFIG.AMAZON_TAG}`,
  'weight-plates':          `https://www.amazon.com/s?k=olympic+weight+plates+set&tag=${CONFIG.AMAZON_TAG}`,
  'bumper-plates':          `https://www.amazon.com/s?k=bumper+plates+set&tag=${CONFIG.AMAZON_TAG}`,

  // Power Racks & Benches
  'power-rack':             `https://www.amazon.com/s?k=power+rack+home+gym&tag=${CONFIG.AMAZON_TAG}`,
  'squat-stand':            `https://www.amazon.com/s?k=squat+stand+home+gym&tag=${CONFIG.AMAZON_TAG}`,
  'weight-bench':           `https://www.amazon.com/s?k=adjustable+weight+bench&tag=${CONFIG.AMAZON_TAG}`,
  'flat-bench':             `https://www.amazon.com/s?k=flat+weight+bench&tag=${CONFIG.AMAZON_TAG}`,

  // Cardio Equipment
  'treadmill':              `https://www.amazon.com/s?k=home+treadmill&tag=${CONFIG.AMAZON_TAG}`,
  'rowing-machine':         `https://www.amazon.com/s?k=rowing+machine+home+gym&tag=${CONFIG.AMAZON_TAG}`,
  'stationary-bike':        `https://www.amazon.com/s?k=stationary+bike+home+gym&tag=${CONFIG.AMAZON_TAG}`,
  'elliptical':             `https://www.amazon.com/s?k=elliptical+machine+home&tag=${CONFIG.AMAZON_TAG}`,
  'assault-bike':           `https://www.amazon.com/s?k=assault+air+bike&tag=${CONFIG.AMAZON_TAG}`,

  // Kettlebells
  'kettlebell':             `https://www.amazon.com/s?k=kettlebell+set&tag=${CONFIG.AMAZON_TAG}`,
  'adjustable-kettlebell':  `https://www.amazon.com/s?k=adjustable+kettlebell&tag=${CONFIG.AMAZON_TAG}`,

  // Accessories
  'resistance-bands':       `https://www.amazon.com/s?k=resistance+bands+set+workout&tag=${CONFIG.AMAZON_TAG}`,
  'pull-up-bar':            `https://www.amazon.com/s?k=doorway+pull+up+bar&tag=${CONFIG.AMAZON_TAG}`,
  'jump-rope':              `https://www.amazon.com/s?k=speed+jump+rope&tag=${CONFIG.AMAZON_TAG}`,
  'ab-roller':              `https://www.amazon.com/s?k=ab+roller+wheel&tag=${CONFIG.AMAZON_TAG}`,
  'foam-roller':            `https://www.amazon.com/s?k=foam+roller+muscle+recovery&tag=${CONFIG.AMAZON_TAG}`,
  'dip-station':            `https://www.amazon.com/s?k=dip+station+home+gym&tag=${CONFIG.AMAZON_TAG}`,
  'trx-suspension':         `https://www.amazon.com/s?k=trx+suspension+trainer&tag=${CONFIG.AMAZON_TAG}`,
  'yoga-mat':               `https://www.amazon.com/s?k=thick+yoga+mat+exercise&tag=${CONFIG.AMAZON_TAG}`,

  // Flooring
  'rubber-flooring':        `https://www.amazon.com/s?k=rubber+gym+flooring+tiles&tag=${CONFIG.AMAZON_TAG}`,
  'stall-mats':             `https://www.amazon.com/s?k=horse+stall+mats+gym+flooring&tag=${CONFIG.AMAZON_TAG}`,
  'foam-tiles':             `https://www.amazon.com/s?k=foam+interlocking+floor+tiles+gym&tag=${CONFIG.AMAZON_TAG}`,

  // Supplements (higher commission via direct programs)
  'whey-protein':           `https://www.amazon.com/s?k=whey+protein+powder&tag=${CONFIG.AMAZON_TAG}`,
  'creatine':               `https://www.amazon.com/s?k=creatine+monohydrate&tag=${CONFIG.AMAZON_TAG}`,
  'pre-workout':            `https://www.amazon.com/s?k=pre+workout+supplement&tag=${CONFIG.AMAZON_TAG}`,

  // Misc
  'gym-mirror':             `https://www.amazon.com/s?k=gym+wall+mirror&tag=${CONFIG.AMAZON_TAG}`,
  'weight-lifting-belt':    `https://www.amazon.com/s?k=weight+lifting+belt&tag=${CONFIG.AMAZON_TAG}`,
  'lifting-straps':         `https://www.amazon.com/s?k=lifting+straps+wrist+wraps&tag=${CONFIG.AMAZON_TAG}`,
};

function getAffiliateLink(itemKey) {
  return AFFILIATE_MAP[itemKey] || `https://www.amazon.com/s?k=${encodeURIComponent(itemKey.replace(/-/g, '+'))}&tag=${CONFIG.AMAZON_TAG}`;
}

function createAffiliateBtn(itemKey, label = 'View on Amazon', classes = '') {
  const link = createElement('a', {
    href: getAffiliateLink(itemKey),
    target: '_blank',
    rel: 'noopener sponsored',
    class: `btn btn--sm btn--primary ${classes}`,
    'data-affiliate': itemKey
  }, label + ' →');

  link.addEventListener('click', () => {
    trackEvent('affiliate_click', { item: itemKey, label });
  });

  return link;
}

// ── Analytics / Tracking ─────────────────────
function trackEvent(name, data = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', name, data);
  }
  // Console log in development
  if (location.hostname === 'localhost') {
    console.log(`📊 Event: ${name}`, data);
  }
}

function trackPageView() {
  trackEvent('page_view', {
    page_title: document.title,
    page_path: window.location.pathname
  });
}

// ── Validation ───────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

// ── Formatting ───────────────────────────────
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// ── Local Storage Helpers ────────────────────
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(`homegymcalc_${key}`, JSON.stringify(value));
    } catch (e) { /* storage not available */ }
  },
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(`homegymcalc_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) { return fallback; }
  },
  remove(key) {
    try { localStorage.removeItem(`homegymcalc_${key}`); } catch (e) { }
  }
};

// ── Smooth Scroll ────────────────────────────
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── Toast Notifications ──────────────────────
function showToast(message, type = 'success', duration = 4000) {
  const toast = createElement('div', { class: `toast toast--${type}` }, message);
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── API Helper ───────────────────────────────
async function callClaude(prompt, systemPrompt = '') {
  const response = await fetch(CONFIG.CLAUDE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// ── Share Results ────────────────────────────
function initShareButtons() {
  $$('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.share;
      const text = btn.dataset.text || 'Check out my home gym plan from HomeGymCalc.com!';
      const url = window.location.href;

      if (type === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard!');
          btn.textContent = '✓ Copied!';
          setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
        });
      } else if (type === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      } else if (type === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }

      trackEvent('share', { method: type });
    });
  });
}

// ── Calculator Step Manager ──────────────────
class StepManager {
  constructor(containerEl, steps, onComplete) {
    this.container = containerEl;
    this.steps = steps;
    this.currentStep = 0;
    this.answers = {};
    this.onComplete = onComplete;
    this.render();
  }

  render() {
    this.updateStepIndicator();
    this.showStep(this.currentStep);
  }

  updateStepIndicator() {
    const indicators = $$('.step', this.container);
    indicators.forEach((indicator, i) => {
      indicator.classList.remove('active', 'done');
      if (i < this.currentStep) indicator.classList.add('done');
      if (i === this.currentStep) indicator.classList.add('active');
    });
  }

  showStep(index) {
    const stepPanels = $$('[data-step]', this.container);
    stepPanels.forEach((panel, i) => {
      panel.classList.toggle('hidden', i !== index);
    });
  }

  next(data = {}) {
    Object.assign(this.answers, data);
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
      this.scrollToTop();
    } else {
      this.onComplete(this.answers);
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
      this.scrollToTop();
    }
  }

  scrollToTop() {
    const offset = 100;
    const top = this.container.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  getAnswers() { return { ...this.answers }; }
}

// ── Print / PDF Results ──────────────────────
function initPrintButtons() {
  $$('[data-print]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
      trackEvent('print_results');
    });
  });
}

// ── Range Input Live Update ──────────────────
function initRangeInputs() {
  $$('.form-range').forEach(range => {
    const output = $(`[data-range-output="${range.id}"]`);
    const prefix = range.dataset.prefix || '';
    const suffix = range.dataset.suffix || '';

    function update() {
      if (output) {
        output.textContent = `${prefix}${formatNumber(range.value)}${suffix}`;
      }
    }

    range.addEventListener('input', update);
    update(); // Initialize
  });
}

// ── Accordion ───────────────────────────────
function initAccordions() {
  $$('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const content = item.querySelector('.accordion__content');
      const isOpen = item.classList.contains('open');

      // Close all
      $$('.accordion__item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion__content').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// ── Init All ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initEmailCapture();
  initSmoothScroll();
  initShareButtons();
  initPrintButtons();
  initRangeInputs();
  initAccordions();
  trackPageView();
});
