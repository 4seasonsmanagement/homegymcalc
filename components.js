/* ============================================
   GYMCALC.IO — HTML COMPONENTS
   Reusable nav, footer, and section templates
   Inject via: document.getElementById('nav-placeholder').innerHTML = COMPONENTS.nav();
   ============================================ */

const COMPONENTS = {

  // ── Navigation ──────────────────────────────
  nav(activePage = '') {
    return `
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="container">
    <div class="nav__inner">
      <a href="/index.html" class="nav__logo">HomeGym<span>Calc</span></a>

      <ul class="nav__links" role="list">
        <li><a href="/index.html"
               class="nav__link ${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/pages/calculators.html"
               class="nav__link ${activePage === 'calculators' ? 'active' : ''}">Calculators</a></li>
        <li><a href="/pages/blog.html"
               class="nav__link ${activePage === 'blog' ? 'active' : ''}">Guides</a></li>
        <li><a href="/pages/about.html"
               class="nav__link ${activePage === 'about' ? 'active' : ''}">About</a></li>
        <li><a href="/pages/equipment-recommender.html"
               class="nav__link nav__cta ${activePage === 'recommender' ? 'active' : ''}">
          Get My Plan →
        </a></li>
      </ul>

      <button class="nav__mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>`;
  },

  // ── Footer ───────────────────────────────────
  footer() {
    const year = new Date().getFullYear();
    return `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__grid">
      <div>
        <div class="footer__logo">HomeGym<span>Calc</span></div>
        <p class="footer__desc">
          Free home gym calculators and tools to help you build smarter, spend less, and train better.
        </p>
      </div>

      <div>
        <div class="footer__heading">Calculators</div>
        <ul class="footer__links" role="list">
          <li><a href="/pages/equipment-recommender.html" class="footer__link">Equipment Recommender</a></li>
          <li><a href="/pages/roi-calculator.html" class="footer__link">ROI Calculator</a></li>
          <li><a href="/pages/phase-builder.html" class="footer__link">Phase Builder</a></li>
          <li><a href="/pages/dumbbells-quiz.html" class="footer__link">Dumbbells Quiz</a></li>
          <li><a href="/pages/cardio-quiz.html" class="footer__link">Cardio Quiz</a></li>
          <li><a href="/pages/budget-allocator.html" class="footer__link">Budget Allocator</a></li>
        </ul>
      </div>

      <div>
        <div class="footer__heading">Guides</div>
        <ul class="footer__links" role="list">
          <li><a href="/pages/blog.html" class="footer__link">All Guides</a></li>
          <li><a href="/pages/blog/home-gym-setup-guide.html" class="footer__link">Beginner's Guide</a></li>
          <li><a href="/pages/blog/small-space-gym.html" class="footer__link">Small Space Gym</a></li>
          <li><a href="/pages/blog/garage-gym-guide.html" class="footer__link">Garage Gym Guide</a></li>
          <li><a href="/pages/blog/gym-vs-membership.html" class="footer__link">Gym vs. Membership</a></li>
        </ul>
      </div>

      <div>
        <div class="footer__heading">Company</div>
        <ul class="footer__links" role="list">
          <li><a href="/pages/about.html" class="footer__link">About</a></li>
          <li><a href="/pages/contact.html" class="footer__link">Contact</a></li>
          <li><a href="/pages/privacy.html" class="footer__link">Privacy Policy</a></li>
          <li><a href="/pages/affiliate-disclosure.html" class="footer__link">Affiliate Disclosure</a></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p class="footer__copy">© ${year} HomeGymCalc.com. All rights reserved.</p>
      <p class="footer__disclaimer">
        HomeGymCalc.com participates in the Amazon Services LLC Associates Program.
        As an Amazon Associate we earn from qualifying purchases at no extra cost to you.
      </p>
    </div>
  </div>
</footer>`;
  },

  // ── Email Capture Block ───────────────────────
  emailCapture(source = 'general', heading = 'Get Your Free Home Gym Starter Guide', subtext = 'Join 5,000+ home gym builders. Get our free 22-page PDF guide, weekly tips, and exclusive deals.') {
    return `
<section class="section--sm">
  <div class="container--narrow">
    <div class="email-capture">
      <div class="hero__eyebrow">📧 Free Resource</div>
      <h3>${heading}</h3>
      <p>${subtext}</p>
      <form class="email-form" data-source="${source}" novalidate>
        <input
          type="email"
          class="form-input"
          placeholder="your@email.com"
          aria-label="Email address"
          required
          autocomplete="email"
        />
        <button type="submit" class="btn btn--primary">
          Get Free Guide
        </button>
      </form>
      <small style="display:block;margin-top:12px;text-align:center;">
        No spam. Unsubscribe anytime.
      </small>
    </div>
  </div>
</section>`;
  },

  // ── Calculator Card ───────────────────────────
  calcCard({ icon, title, desc, href, tag = 'Free', isNew = false, comingSoon = false }) {
    const badge = isNew
      ? `<span class="badge badge--new">New</span>`
      : comingSoon
        ? `<span class="badge badge--soon">Coming Soon</span>`
        : `<span class="badge badge--popular">${tag}</span>`;

    return `
<a href="${comingSoon ? '#' : href}" class="calc-card ${comingSoon ? 'calc-card--disabled' : ''}" style="${comingSoon ? 'opacity:0.6;pointer-events:none;' : ''}">
  <div class="calc-card__icon">${icon}</div>
  <div style="display:flex;align-items:center;gap:8px;">
    <span class="calc-card__title">${title}</span>
    ${badge}
  </div>
  <p class="calc-card__desc">${desc}</p>
  <div class="btn btn--ghost btn--sm" style="margin-top:auto;">
    ${comingSoon ? 'Coming Soon' : 'Open Calculator →'}
  </div>
</a>`;
  },

  // ── Section Header ───────────────────────────
  sectionHeader({ eyebrow = '', title, subtitle = '', center = false }) {
    return `
<div class="section-header ${center ? 'section-header--center' : ''}">
  ${eyebrow ? `<div class="section-header__eyebrow">${eyebrow}</div>` : ''}
  <h2>${title}</h2>
  ${subtitle ? `<p>${subtitle}</p>` : ''}
</div>`;
  },

  // ── Loading Spinner ───────────────────────────
  loading(text = 'Generating your plan...') {
    return `
<div class="loading" role="status" aria-live="polite">
  <div class="spinner" aria-hidden="true"></div>
  <p class="loading-text">${text}</p>
</div>`;
  },

  // ── Toast Styles (inject once into head) ─────
  toastStyles() {
    return `
<style>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--dark-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--success);
  border-radius: var(--border-radius);
  padding: 14px 20px;
  font-size: 0.9rem;
  color: var(--white);
  box-shadow: var(--shadow-lg);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
  max-width: 320px;
}
.toast--visible { transform: translateY(0); opacity: 1; }
.toast--error { border-left-color: var(--error); }
.toast--warning { border-left-color: var(--warning); }

.email-success {
  text-align: center;
  padding: 24px;
}
.email-success__icon {
  width: 48px; height: 48px;
  background: var(--success);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: white;
  margin: 0 auto 16px;
}
.email-success h4 {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.email-success p { font-size: 0.9rem; color: var(--gray-light); }

@media print {
  .nav, .footer, .email-capture, .btn--secondary { display: none !important; }
  body { background: white; color: black; }
  .result-card { border: 1px solid #ccc; }
}
</style>`;
  },

  // ── Page Head Template ───────────────────────
  pageHead({ title, description, canonical, ogImage = '/images/og-default.jpg' }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary Meta -->
  <title>${title} | HomeGymCalc.com</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  ${canonical ? `<link rel="canonical" href="https://homegymcalc.com${canonical}" />` : ''}

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title} | HomeGymCalc.com" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="https://homegymcalc.com${ogImage}" />
  <meta property="og:url" content="https://homegymcalc.com${canonical || ''}" />
  <meta property="og:site_name" content="HomeGymCalc.com" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} | HomeGymCalc.com" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://homegymcalc.com${ogImage}" />

  <!-- Favicon (add your actual favicon later) -->
  <link rel="icon" href="/favicon.ico" />

  <!-- Fonts & CSS -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="/css/main.css" />

  <!-- Google Analytics (replace GA_MEASUREMENT_ID) -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script> -->
</head>`;
  }
};

// Export for use in Node/build tools if needed
if (typeof module !== 'undefined') module.exports = COMPONENTS;
