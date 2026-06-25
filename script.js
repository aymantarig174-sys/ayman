/* ============================================
   Game Zoom - script.js
   JavaScript Ø¹Ø§Ø¯ÙŠ â€” Ø¨Ø¯ÙˆÙ† frameworks
   ============================================ */

const API_BASE_URL = "https://gamezoom-54hb.onrender.com";
const THEME_STORAGE_KEY = 'gz_store_theme';

(function applySavedTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.setAttribute('data-store-theme', 'dark');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    localStorage.removeItem('gz_theme');
  } catch (err) {
    // Keep the current page theme even if storage is blocked.
  }
})();

// ==========================================
// 1. Ø¹Ù†Ø§ØµØ± Ù…Ø´ØªØ±ÙƒØ©
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCartBadge();
  schedulePageMotion();

  // ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬
  if (document.getElementById('productForm')) {
    initProductPage();
  }

  // ØµÙØ­Ø© Ø§Ù„Ø³Ù„Ø© ÙˆØ§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…ÙˆØ­Ø¯Ø©
  if (document.getElementById('checkoutForm')) {
    initCartPage();
  }
});

function initThemeToggle() {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.setAttribute('data-store-theme', 'dark');
}

function initPageMotion() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealItems = document.querySelectorAll([
    '.page-header',
    '.product-form-card',
    '.price-card',
    '.info-box',
    '.form-section',
    '.footer',
    '.footer-col',
    '.footer-brand'
  ].join(','));

  revealItems.forEach((item, index) => {
    item.classList.add('motion-reveal');
    item.style.transitionDelay = `${Math.min((index % 6) * 45, 225)}ms`;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -32px 0px' });

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) {
        item.classList.add('is-visible');
      } else {
        observer.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      document.body.classList.add('page-soft-exit');
    });
  });
}

function schedulePageMotion() {
  // Content motion is disabled; header logo animation remains in CSS.
}

// ==========================================
// 2. Ø§Ù„Ù‡ÙŠØ¯Ø± â€” ØªØ£Ø«ÙŠØ± Ø§Ù„ØªÙ…Ø±ÙŠØ±
// ==========================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  // Force Scrolled style on pages that are not index.html
  if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '') {
    header.classList.add('scrolled');
    return;
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ==========================================
// 3. Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠØ© Ù„Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„
// ==========================================
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ==========================================
// 4. Ø§Ù„Ø¬Ø²ÙŠØ¦Ø§Øª Ø§Ù„Ù…ØªØ­Ø±ÙƒØ© (Hero)
// ==========================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 6 + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    p.style.width = (2 + Math.random() * 3) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

// ==========================================
// 5. Ø´Ø§Ø±Ø© Ø§Ù„Ø³Ù„Ø©
// ==========================================
function initCartBadge() {
  const badge = document.getElementById('cartCount');
  const cartBtn = document.getElementById('cartBtn');
  if (!badge && !cartBtn) return;

  const orderStr = localStorage.getItem('gz_order');
  let order = null;

  if (orderStr) {
    try {
      order = JSON.parse(orderStr);
    } catch (err) {
      console.error('Invalid cart data', err);
      localStorage.removeItem('gz_order');
    }
  }

  if (order) {
    if (badge) {
      badge.style.display = 'flex';
      badge.textContent = '1';
    }

    if (cartBtn) {
      const miniText = `${order.mode || ''} | ${order.currentRank || ''} â† ${order.targetRank || ''} | ${order.total || 0} Ø±ÙŠØ§Ù„`;
      cartBtn.setAttribute('aria-label', `Ø§Ù„Ø³Ù„Ø© ØªØ­ØªÙˆÙŠ Ø¹Ù„Ù‰: ${miniText}`);
      cartBtn.setAttribute('title', `Ø§Ù„Ø³Ù„Ø© ØªØ­ØªÙˆÙŠ Ø¹Ù„Ù‰: ${miniText}`);

      let miniSummary = cartBtn.querySelector('.cart-summary-mini');
      if (!miniSummary) {
        miniSummary = document.createElement('span');
        miniSummary.className = 'cart-summary-mini';
        cartBtn.appendChild(miniSummary);
      }
      miniSummary.textContent = miniText;
    }
  } else {
    if (badge) badge.style.display = 'none';

    if (cartBtn) {
      cartBtn.setAttribute('aria-label', 'Ø§Ù„Ø³Ù„Ø©');
      cartBtn.setAttribute('title', 'Ø§Ù„Ø³Ù„Ø©');
      const miniSummary = cartBtn.querySelector('.cart-summary-mini');
      if (miniSummary) miniSummary.remove();
    }
  }
}

// ==========================================
// 6. Toast Ø¥Ø´Ø¹Ø§Ø±
// ==========================================
function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function loadGeideaCheckoutScript(src) {
  const fallbackScripts = [
    src,
    'https://www.ksamerchant.geidea.net/hpp/geideaCheckout.min.js',
    'https://www.merchant.geidea.net/hpp/geideaCheckout.min.js',
    'https://www.merchant.geidea.ae/hpp/geideaCheckout.min.js'
  ].filter(Boolean);

  return new Promise((resolve, reject) => {
    if (window.GeideaCheckout) return resolve();

    const loadScriptAt = index => {
      const scriptUrl = fallbackScripts[index];
      if (!scriptUrl) {
        reject(new Error('Unable to load payment gateway.'));
        return;
      }

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.dataset.geideaCheckout = 'true';
      script.onload = () => {
        if (window.GeideaCheckout) resolve();
        else loadScriptAt(index + 1);
      };
      script.onerror = () => loadScriptAt(index + 1);
      document.head.appendChild(script);
    };

    const existing = document.querySelector('script[data-geidea-checkout]');
    if (existing) existing.remove();
    loadScriptAt(0);
  });
}

async function startGeideaCheckout({ sessionId, checkoutScript, onSuccess, onError, onCancel }) {
  await loadGeideaCheckoutScript(checkoutScript);
  if (!window.GeideaCheckout) throw new Error('Payment gateway is unavailable.');
  const payment = new window.GeideaCheckout(onSuccess, onError, onCancel);
  payment.startPayment(sessionId);
}

// ==========================================
// 7. ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬ â€” Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„ØªÙ„Ù‚Ø§Ø¦ÙŠ ÙˆØ§Ù„Ø£Ø³Ø¹Ø§Ø±
// ==========================================

const RANK_PRICES = {
  'ØºÙŠØ± Ù…ØµÙ†Ù': 20 + Math.floor(Math.random() * 20),
  'Ø¨Ø±ÙˆÙ†Ø²': 40 + Math.floor(Math.random() * 30),
  'Ø³ÙŠÙ„ÙØ±': 70 + Math.floor(Math.random() * 30),
  'Ù‚ÙˆÙ„Ø¯': 100 + Math.floor(Math.random() * 50),
  'Ø¨Ù„Ø§ØªÙŠÙ†ÙŠÙˆÙ…': 150 + Math.floor(Math.random() * 50),
  'Ø¯Ø§ÙŠÙ…ÙˆÙ†Ø¯': 200 + Math.floor(Math.random() * 100),
  'ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†': 300 + Math.floor(Math.random() * 150),
  'Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†': 450 + Math.floor(Math.random() * 250)
};

const RANK_ORDER = [
  'ØºÙŠØ± Ù…ØµÙ†Ù',
  'Ø¨Ø±ÙˆÙ†Ø²',
  'Ø³ÙŠÙ„ÙØ±',
  'Ù‚ÙˆÙ„Ø¯',
  'Ø¨Ù„Ø§ØªÙŠÙ†ÙŠÙˆÙ…',
  'Ø¯Ø§ÙŠÙ…ÙˆÙ†Ø¯',
  'ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†',
  'Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†'
];

function getRankScore(tier, div) {
  if (!tier) return -1;
  const tierIndex = RANK_ORDER.indexOf(tier);
  if (tierIndex === -1) return -1;
  if (tier === 'ØºÙŠØ± Ù…ØµÙ†Ù') return 0;
  const division = parseInt(div, 10);
  const safeDivision = Number.isFinite(division) && division >= 1 ? division : 1;
  return tierIndex * 3 + (safeDivision - 1);
}

function getFormattedRank() {
  const curTier = document.getElementById('curRankTier')?.value || '';
  const curDiv = document.getElementById('curRankDiv')?.value || '1';
  const tarTier = document.getElementById('tarRankTier')?.value || '';
  const tarDiv = document.getElementById('tarRankDiv')?.value || '1';

  if (!curTier || !tarTier) {
    return { curLabel: '', tarLabel: '', curScore: -1, tarScore: -2 };
  }

  const curLabel = curTier === 'ØºÙŠØ± Ù…ØµÙ†Ù' ? 'ØºÙŠØ± Ù…ØµÙ†Ù' : `${curTier} ${curDiv || '1'}`;
  const tarLabel = tarTier === 'ØºÙŠØ± Ù…ØµÙ†Ù' ? 'ØºÙŠØ± Ù…ØµÙ†Ù' : `${tarTier} ${tarDiv || '1'}`;

  return {
    curLabel,
    tarLabel,
    curScore: getRankScore(curTier, curDiv || '1'),
    tarScore: getRankScore(tarTier, tarDiv || '1')
  };
}

function validateModeRestrictions() {
  const mode = getRadioValue('mode');
  const tarTierSelect = document.getElementById('tarRankTier');
  const tarDivSelect = document.getElementById('tarRankDiv');
  const validationMsg = document.getElementById('rankValidationMsg');

  if (!tarTierSelect || !tarDivSelect) return true;

  const tarTier = tarTierSelect.value;
  const tarDiv = tarDivSelect.value;

  if (!tarTier) return true;

  const tarScore = getRankScore(tarTier, tarDiv);

  let maxScore = 999;
  let msg = '';

  if (mode === '2v2') {
    maxScore = getRankScore('Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†', 1);
    msg = 'Ø£Ø¹Ù„Ù‰ Ø±Ø§Ù†Ùƒ Ù…ØªØ§Ø­ ÙÙŠ Ø·ÙˆØ± 2v2 Ù‡Ùˆ Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ† 1';
  } else if (mode === 'Ø±Ø§Ù…Ø¨Ù„' || mode === 'Ù‡ÙŠØªØ³ÙŠÙƒØ±') {
    maxScore = getRankScore('ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†', 2);
    msg = `Ø£Ø¹Ù„Ù‰ Ø±Ø§Ù†Ùƒ Ù…ØªØ§Ø­ ÙÙŠ Ø·ÙˆØ± ${mode} Ù‡Ùˆ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ† 2`;
  } else if (mode === '1v1' || mode === '3v3' || mode === 'Ø¯Ø±ÙˆØ¨Ø´ÙˆØª') {
    maxScore = getRankScore('ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†', 1);
    msg = `Ø£Ø¹Ù„Ù‰ Ø±Ø§Ù†Ùƒ Ù…ØªØ§Ø­ ÙÙŠ Ø·ÙˆØ± ${mode} Ù‡Ùˆ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ† 1`;
  }

  if (tarScore > maxScore) {
    if (validationMsg) validationMsg.innerHTML = `âš ï¸ ${msg}`;
    tarTierSelect.value = '';
    tarDivSelect.style.display = 'none';
    return false;
  }

  return true;
}

function validateRankSelection() {
  const { curScore, tarScore } = getFormattedRank();
  const validationMsg = document.getElementById('rankValidationMsg');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const mobileSubmit = document.getElementById('mobileSubmit');

  if (validationMsg) {
    validationMsg.innerHTML = '';
    validationMsg.style.color = '#f87171';
  }

  if (curScore === -1 || tarScore === -2) {
      if (addToCartBtn) addToCartBtn.disabled = true;
      if (mobileSubmit) mobileSubmit.disabled = true;
      return false;
  }

  if (tarScore <= curScore) {
    if (validationMsg) {
      validationMsg.innerHTML = 'âš ï¸ Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø£Ø¹Ù„Ù‰ Ù…Ù† Ø±Ø§Ù†ÙƒÙƒ Ø§Ù„Ø­Ø§Ù„ÙŠ.';
    }
    if (addToCartBtn) addToCartBtn.disabled = true;
    if (mobileSubmit) mobileSubmit.disabled = true;
    return false;
  } else if (!validateModeRestrictions()) {
     if (addToCartBtn) addToCartBtn.disabled = true;
     if (mobileSubmit) mobileSubmit.disabled = true;
     return false;
  } else {
    if (addToCartBtn) addToCartBtn.disabled = false;
    if (mobileSubmit) mobileSubmit.disabled = false;
    return true;
  }
}

function initProductPage() {
  const form = document.getElementById('productForm');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const mobileSubmit = document.getElementById('mobileSubmit');

  // Mode selection enforcement
  const modeRadios = form.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
          modeRadios.forEach(r => {
              if (r !== radio) r.checked = false;
          });
          updateRankAvailability();
          updatePriceSummary();
      });
  });

  // Rank availability logic
  function updateRankAvailability() {
      const mode = getRadioValue('mode');
      const tarTierSelect = document.getElementById('tarRankTier');
      const gcOption = Array.from(tarTierSelect.options).find(o => o.value === 'Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†');

      if (gcOption) {
          gcOption.disabled = (mode !== '2v2');
          // If already selected and mode changed to restricted, clear
          if (gcOption.disabled && tarTierSelect.value === 'Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†') {
              tarTierSelect.value = '';
              document.getElementById('tarRankDiv').style.display = 'none';
          }
      }
  }

  // Rank drop down logic
  const curTier = document.getElementById('curRankTier');
  const curDiv = document.getElementById('curRankDiv');
  const tarTier = document.getElementById('tarRankTier');
  const tarDiv = document.getElementById('tarRankDiv');

  function toggleDivisions(tierSelect, divSelect) {
      const mode = getRadioValue('mode');
      const isChamp1Restriction = (mode === '1v1' || mode === '3v3' || mode === 'Ø¯Ø±ÙˆØ¨Ø´ÙˆØª');
      const isChamp2Restriction = (mode === 'Ø±Ø§Ù…Ø¨Ù„' || mode === 'Ù‡ÙŠØªØ³ÙŠÙƒØ±');

      // Hide divisions for specific Current Ranks
      const noDivisionsCurrent = ['ØºÙŠØ± Ù…ØµÙ†Ù', 'Ø¨Ø±ÙˆÙ†Ø²', 'Ø³ÙŠÙ„ÙØ±', 'Ù‚ÙˆÙ„Ø¯'];
      if (tierSelect.id === 'curRankTier' && noDivisionsCurrent.includes(tierSelect.value)) {
          divSelect.style.display = 'none';
          return;
      }

      if (tierSelect.value === 'Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†') {
          divSelect.innerHTML = '<option value="1">1</option>';
      } else if (tierSelect.value === 'ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†' && isChamp1Restriction) {
          divSelect.innerHTML = '<option value="1">1</option>';
      } else if (tierSelect.value === 'ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†' && isChamp2Restriction) {
          divSelect.innerHTML = '<option value="1">1</option><option value="2">2</option>';
      } else if (tierSelect.value !== "" && tierSelect.value !== "Ù‚Ø±Ø§Ù†Ø¯ ØªØ´Ø§Ù…Ø¨ÙŠÙˆÙ†") {
          divSelect.innerHTML = '<option value="1">1</option><option value="2">2</option><option value="3">3</option>';
      }

      if (tierSelect.value !== '') {
          divSelect.style.display = 'block';
      } else {
          divSelect.style.display = 'none';
      }
  }

  [curTier, tarTier].forEach(tier => {
      tier.addEventListener('change', () => {
          if (tier === curTier) toggleDivisions(curTier, curDiv);
          else toggleDivisions(tarTier, tarDiv);
          updatePriceSummary();
      });
  });

  // Ù‚ÙŠÙˆØ¯ Ø§Ù„Ø£Ø·ÙˆØ§Ø± ÙŠØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù†Ù‡Ø§ Ø¹Ø¨Ø± validateModeRestrictions Ø§Ù„Ø¹Ø§Ù…Ø©.
  if (window.innerWidth <= 1024 && mobileSubmit) {
    mobileSubmit.style.display = 'flex';
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024 && mobileSubmit) {
      mobileSubmit.style.display = 'flex';
    } else if (mobileSubmit) {
      mobileSubmit.style.display = 'none';
    }
  });

  form.addEventListener('change', updatePriceSummary);

  // Initialize and run validation immediately
  toggleDivisions(curTier, curDiv);
  toggleDivisions(tarTier, tarDiv);
  updateRankAvailability();
  validateRankSelection();
  updatePriceSummary();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAddToCart(form);
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(form);
    });
  }
}

function updatePriceSummary() {
  validateRankSelection();

  const mode = getRadioValue('mode');
  const platform = getRadioValue('platform');
  const { curLabel, tarLabel } = getFormattedRank();
  const reward = getRadioValue('reward');
  const tarTier = document.getElementById('tarRankTier').value;

  let rankPrice = RANK_PRICES[tarTier] || 0;

  const rewardPrice = reward === 'none' ? 0 : parseInt(reward);
  const total = rankPrice + rewardPrice;

  setText('summaryMode', mode);
  setText('summaryPlatform', platform);
  setText('summaryCurrentRank', curLabel);
  setText('summaryTargetRank', tarLabel);
  setText('summaryRankPrice', rankPrice + ' Ø±ÙŠØ§Ù„');

  if (reward === 'none') {
    setText('summaryReward', 'Ø¨Ø¯ÙˆÙ†');
    setText('summaryRewardPrice', '0 Ø±ÙŠØ§Ù„');
  } else {
    setText('summaryReward', 'Ù…Ø¹ Ø±ÙŠÙˆØ§Ø±Ø¯');
    setText('summaryRewardPrice', '+' + rewardPrice + ' Ø±ÙŠØ§Ù„');
  }

  setText('summaryTotal', total + ' Ø±ÙŠØ§Ù„');
}

function handleAddToCart(form) {
  if (!validateRankSelection()) {
    showToast('âš ï¸ ÙŠØ±Ø¬Ù‰ ØªØµØ­ÙŠØ­ ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ø±Ø§Ù†Ùƒ: Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨ ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø£Ø¹Ù„Ù‰ Ù…Ù† Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ.');
    return;
  }

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showToast('âš ï¸ ÙŠØ±Ø¬Ù‰ ØªØ¹Ø¨Ø¦Ø© Ø­Ù‚ÙˆÙ„ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© (Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ ÙˆÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ±)');
    if (!email) document.getElementById('email').focus();
    else document.getElementById('password').focus();
    return;
  }

  const terms = ['term1', 'term3', 'term4'];
  for (const id of terms) {
    const cb = document.getElementById(id);
    if (cb && !cb.checked) {
      showToast('âš ï¸ ÙŠØ¬Ø¨ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø© Ø¹Ù„Ù‰ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø´Ø±ÙˆØ· Ø£ÙˆÙ„Ø§Ù‹');
      cb.focus();
      return;
    }
  }

  const mode = getRadioValue('mode');
  const platform = getRadioValue('platform');
  const { curLabel, tarLabel } = getFormattedRank();
  const reward = getRadioValue('reward');
  const notes = document.getElementById('notes').value.trim();
  const tarTier = document.getElementById('tarRankTier').value;

  let rankPrice = RANK_PRICES[tarTier] || 0;

  const rewardPrice = reward === 'none' ? 0 : parseInt(reward);
  const total = rankPrice + rewardPrice;

  const rewardLabel = reward === 'none' ? 'Ø¨Ø¯ÙˆÙ† Ø±ÙŠÙˆØ§Ø±Ø¯' : (reward === '40' ? 'Ø±ÙŠÙˆØ§Ø±Ø¯ Ø¥Ø¶Ø§ÙÙŠ (+40 Ø±ÙŠØ§Ù„)' : 'Ù…Ø¹ Ø±ÙŠÙˆØ§Ø±Ø¯ (+20 Ø±ÙŠØ§Ù„)');

  // CRITICAL SECURITY FIX: Do NOT store the user password in localStorage! Exclude entirely.
  // Temporarily store it in sessionStorage which clears when the browser tab is closed.
  sessionStorage.setItem('gz_password', password);

  const orderData = {
    mode,
    platform,
    currentRank: curLabel,
    targetRank: tarLabel,
    reward: rewardLabel,
    rewardPriceNum: rewardPrice,
    rankPrice,
    total,
    email,
    notes,
    timestamp: new Date().toISOString()
  };

  // Convert to String & Save
  localStorage.setItem('gz_order', JSON.stringify(orderData));

  showToast('âœ… ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© Ø·Ù„Ø¨ Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ Ù„Ù„Ø³Ù„Ø© Ø¨Ù†Ø¬Ø§Ø­!');

  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.style.display = 'flex';
    badge.textContent = '1';
  }

  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 500);
}

// ==========================================
// 8. ØµÙØ­Ø© Ø§Ù„Ø³Ù„Ø© ÙˆØ§Ù„Ø¯ÙØ¹ Ø§Ù„Ù…ÙˆØ­Ø¯Ø©
// ==========================================
function initCartPage() {
  const orderStr = localStorage.getItem('gz_order');
  const emptyState = document.getElementById('emptyState');
  const checkoutContent = document.getElementById('checkoutContent');

  if (!orderStr) {
    if (emptyState) emptyState.style.display = 'block';
    if (checkoutContent) checkoutContent.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (checkoutContent) checkoutContent.style.display = 'grid';

  let order;
  try {
    order = JSON.parse(orderStr);
  } catch (err) {
    console.error('Invalid cart data', err);
    localStorage.removeItem('gz_order');
    if (emptyState) emptyState.style.display = 'block';
    if (checkoutContent) checkoutContent.style.display = 'none';
    initCartBadge();
    return;
  }

  // Ø¨Ø±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„ ÙŠØ¬Ø¨ Ø£Ù† ÙŠØ¨Ù‚Ù‰ ÙØ§Ø±ØºØ§Ù‹ Ù„ÙŠØ¹Ø¨Ù‘ÙŠÙ‡ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ø¨Ù†ÙØ³Ù‡ ÙÙŠ Ø§Ù„Ø³Ù„Ø©.
  // Ù„Ø§ Ù†Ù‚ÙˆÙ… Ø¨ØªØ¹Ø¨Ø¦ØªÙ‡ ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹ Ù…Ù† Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ ØµÙØ­Ø© Ø§Ù„Ø·Ù„Ø¨.

  // Fill summary HTML
  const summaryItems = document.getElementById('orderSummaryItems');
  if (summaryItems) summaryItems.innerHTML = buildSummaryHTML(order);

  const sidebarDetails = document.getElementById('sidebarDetails');
  if (sidebarDetails) sidebarDetails.innerHTML = buildSidebarHTML(order);

  setText('checkoutPrice', order.total + ' Ø±ÙŠØ§Ù„');
  setText('checkoutTotal', order.total + ' Ø±ÙŠØ§Ù„');
  setText('sidebarTotal', order.total + ' Ø±ÙŠØ§Ù„');

  // Wire up remove button
  const removeBtn = document.getElementById('dangerRemoveBtn');
  if (removeBtn) {
    removeBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('gz_order');
      initCartBadge();
      showToast('ðŸ—‘ï¸ ØªÙ…Øª Ø¥Ø²Ø§Ù„Ø© Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„Ø³Ù„Ø©');
      initCartPage(); // Re-toggle to empty state
    };
  }

  // Checkout Form Submission
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.onsubmit = async (e) => {
      e.preventDefault();

      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const email = document.getElementById('custEmail').value.trim();
      const accountEmail = order.email || '';
      const accountPassword = sessionStorage.getItem('gz_password') || '';

      if (!name || !phone || !email) {
        showToast('âš ï¸ ÙŠØ±Ø¬Ù‰ ØªØ¹Ø¨Ø¦Ø© Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ„ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© (Ø§Ù„Ø§Ø³Ù…ØŒ Ø§Ù„Ø¬ÙˆØ§Ù„ØŒ Ø¨Ø±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„)');
        return;
      }

      const payload = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email,          // Ø¨Ø±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ù† Ø§Ù„Ø³Ù„Ø©
        contactEmail: email,           // Ø¨Ø±ÙŠØ¯ Ø§Ù„ØªÙˆØ§ØµÙ„ Ù…Ù† Ø§Ù„Ø³Ù„Ø©
        accountEmail: accountEmail,    // Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„Ø­Ø³Ø§Ø¨ Ù…Ù† ØµÙØ­Ø© Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ
        orderEmail: accountEmail,      // Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„Ø­Ø³Ø§Ø¨ Ù…Ù† ØµÙØ­Ø© Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ
        password: accountPassword,     // ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØªØ¸Ù‡Ø± ÙÙŠ Ù„ÙˆØ­Ø© Ø§Ù„Ø£Ø¯Ù…Ù† ÙÙ‚Ø· ÙˆÙ„Ø§ ØªØ±Ø³Ù„ Ø¨Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„
        platform: order.platform,
        mode: order.mode,
        currentRank: order.currentRank,
        targetRank: order.targetRank,
        reward: order.reward,
        total: order.total,
        notes: order.notes,
        returnUrl: `${location.origin}/success.html`
      };

      const confirmBtn = document.getElementById('confirmOrderBtn');
      const originalBtnText = confirmBtn.innerHTML;

      try {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="spinner"></span> Ø³ÙŠØªÙ… ØªÙˆØ¬ÙŠÙ‡Ùƒ...';

        // Submit to Geidea initiation backend endpoint
        const response = await fetch(`${API_BASE_URL}/api/geidea/rocket-pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Always try to parse, but handle potential JSON parsing failure
        let result = {};
        try {
          const text = await response.text();
          result = text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('Failed to parse JSON response', e);
          throw new Error('Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø§ØªØµØ§Ù„ Ø¨Ø§Ù„Ø³ÙŠØ±ÙØ±. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹.');
        }

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'ÙØ´Ù„Øª Ø¹Ù…Ù„ÙŠØ© ØªÙ‡ÙŠØ¦Ø© Ø§Ù„Ø¯ÙØ¹ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹');
        }

        await startGeideaCheckout({
          sessionId: result.sessionId,
          checkoutScript: result.checkoutScript,
          onSuccess: async paymentResult => {
            await fetch(`${API_BASE_URL}/api/geidea/checkout-result`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...paymentResult, sessionId: result.sessionId, orderNumber: result.orderNumber, trackingId: result.trackingId })
            }).catch(() => {});
            localStorage.removeItem('gz_order');
            sessionStorage.removeItem('gz_password');
            initCartBadge();
            showToast('Payment completed.');
            window.location.href = `success.html?order=${encodeURIComponent(result.orderNumber || '')}&tracking=${encodeURIComponent(result.trackingId || '')}`;
          },
          onError: error => {
            showToast(`Payment error: ${error?.responseMessage || error?.message || 'Unable to complete payment.'}`);
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
          },
          onCancel: () => {
            showToast('Payment cancelled.');
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = originalBtnText;
          }
        });
        return;

        // Success routines: clear localStorage of order data and sessionStorage of password
        localStorage.removeItem('gz_order');
        sessionStorage.removeItem('gz_password');

        initCartBadge(); // Clear badge count immediately

        showToast('ðŸ’³ Ø¬Ø§Ø±ÙŠ ØªÙˆØ¬ÙŠÙ‡Ùƒ Ù„Ø¨ÙˆØ§Ø¨Ø© Ø§Ù„Ø¯ÙØ¹ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù…ÙŠØ³Ø±...');

        // Redirect customer to Moyasar hosted checkout page
        setTimeout(() => {
          window.location.href = result.checkoutUrl;
        }, 800);

      } catch (err) {
        console.error(err);
        showToast(`âŒ Ø®Ø·Ø£: ${err.message}`);
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalBtnText;
      }
    };
  }
}

function buildSummaryHTML(order) {
  return `
    <div class="summary-item">
      <span class="label">Ø§Ù„Ø®Ø¯Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©</span>
      <span class="value">Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ ÙˆØ§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯Ø²</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø§Ù„Ø·ÙˆØ± (Mode)</span>
      <span class="value">${order.mode}</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø§Ù„Ù…Ù†ØµØ© (Platform)</span>
      <span class="value">${order.platform}</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ø­Ø§Ù„ÙŠ</span>
      <span class="value">${order.currentRank}</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø§Ù„Ø±Ø§Ù†Ùƒ Ø§Ù„Ù…Ø·Ù„ÙˆØ¨</span>
      <span class="value">${order.targetRank}</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø³ÙŠØ²ÙˆÙ† Ø±ÙŠÙˆØ§Ø±Ø¯</span>
      <span class="value">${order.reward}</span>
    </div>
    <div class="summary-item">
      <span class="label">Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ Ù„Ù„Ø­Ø³Ø§Ø¨</span>
      <span class="value">${order.email || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯'}</span>
    </div>
    ${order.notes ? `
      <div class="summary-item">
        <span class="label">Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„</span>
        <span class="value">${order.notes}</span>
      </div>
    ` : ''}
  `;
}

function buildSidebarHTML(order) {
  return `
    <div class="price-row">
      <span class="label">Ø³Ø¹Ø± Ø±ÙØ¹ Ø§Ù„Ø±Ø§Ù†Ùƒ</span>
      <span class="value">${order.rankPrice} Ø±ÙŠØ§Ù„</span>
    </div>
    <div class="price-row">
      <span class="label">Ø³Ø¹Ø± Ø§Ù„Ø±ÙŠÙˆØ§Ø±Ø¯</span>
      <span class="value">${order.rewardPriceNum} Ø±ÙŠØ§Ù„</span>
    </div>
    <div class="price-row">
      <span class="label">Ø§Ù„Ù…Ù†ØµØ© Ø§Ù„Ù…Ø®ØªØ§Ø±Ø©</span>
      <span class="value">${order.platform}</span>
    </div>
    <div class="price-row">
      <span class="label">${order.currentRank} â† ${order.targetRank}</span>
      <span class="value" style="color: var(--success)">âœ“ Ø¬Ø§Ù‡Ø²</span>
    </div>
    ${order.notes ? `
      <div style="font-size: 0.8rem; border-top: 1px dashed var(--border-dark); margin-top: 8px; padding-top: 8px; color: var(--text-muted);">
        <strong>Ù…Ù„Ø§Ø­Ø¸ØªÙƒ Ø§Ù„Ù…ÙƒØªÙˆØ¨Ø©:</strong> ${order.notes}
      </div>
    ` : ''}
  `;
}

// ==========================================
// 9. Ø£Ø¯ÙˆØ§Øª Ù…Ø³Ø§Ø¹Ø¯Ø©
// ==========================================

function getRadioValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// Intersection Observer for animated entries
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// Logo loaded directly on client-side from protected assets/header.png




// Fallback check for broken images
window.addEventListener('error', function(e) {
  if (e.target && e.target.tagName === 'IMG') {
    console.error('Image failed to load:', e.target.src || e.target.getAttribute('src'));
  }
}, true);



/* =========================================================
   Game Zoom editable marketplace
   Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…ØªØ¬Ø± ØªØ­ÙØ¸ ÙÙŠ LocalStorageØŒ ÙˆÙŠÙ…ÙƒÙ† Ù„Ø§Ø­Ù‚Ø§Ù‹ Ø±Ø¨Ø·Ù‡Ø§ Ø¨Ù‚Ø§Ø¹Ø¯Ø© Ø¨ÙŠØ§Ù†Ø§Øª.
   ========================================================= */
const GZ_STORE_KEY = 'gz_marketplace_v1';
const GZ_USER_KEY = 'gz_customer_v1';

const GZ_DEFAULT_STORE = {
  logo: 'assets/header.png',
  hero: {
    image: 'assets/banner.png',
    title: 'Ø¹Ø±ÙˆØ¶ Game Zoom',
    subtitle: 'Ø§Ø¶ØºØ· Ù„Ø§Ø³ØªØ¹Ø±Ø§Ø¶ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª',
    link: '#products'
  },
  verifications: {
    freelance: 'FL-715271404',
    business: 'Ø¨Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø§Ø¹ØªÙ…Ø§Ø¯'
  },
  categories: [
    { id: 'rocket-league', name: 'Rocket League', desc: 'Ø®Ø¯Ù…Ø§Øª Ø±ÙØ¹ Ø±Ø§Ù†Ùƒ ÙˆØ±ÙˆÙŠØ§Ø±Ø¯Ø²', image: 'assets/banner.png', link: 'product.html', visible: true },
    { id: 'fc27', name: 'FIFA / FC 27', desc: 'Ù…Ù†ØªØ¬Ø§Øª ÙˆØ®Ø¯Ù…Ø§Øª FC', image: 'assets/banner.png', link: 'category.html?cat=fc27', visible: true },
    { id: 'grand', name: 'Grand', desc: 'Ù…Ù†ØªØ¬Ø§Øª Grand Ø§Ù„Ø±Ù‚Ù…ÙŠØ©', image: 'assets/banner-mobile.png', link: 'category.html?cat=grand', visible: true },
    { id: 'subscriptions', name: 'Ø§Ø´ØªØ±Ø§ÙƒØ§Øª', desc: 'Ø§Ø´ØªØ±Ø§ÙƒØ§Øª Ø±Ù‚Ù…ÙŠØ©', image: 'assets/banner-mobile.png', link: 'category.html?cat=subscriptions', visible: true }
  ],
  products: [
    { id: 'rocket-rank', category: 'rocket-league', name: 'Ø±ÙØ¹ Ø±Ø§Ù†Ùƒ Rocket League', desc: 'Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ø£ØµÙ„ÙŠ Ø§Ù„Ù…ÙˆØ¬ÙˆØ¯ ÙÙŠ Ø§Ù„Ù…ÙˆÙ‚Ø¹ Ø¨Ø¯ÙˆÙ† Ø­Ø°Ù Ø£Ùˆ ØªØ¹Ø¯ÙŠÙ„.', price: 0, image: 'assets/season-reward.png', link: 'product.html', visible: true, options: '1v1, 2v2, 3v3, Rewards' },
    { id: 'fc27-1', category: 'fc27', name: 'Ù…Ù†ØªØ¬ FC 27', desc: 'Ø£Ø¶Ù ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', price: 0, image: 'assets/banner.png', link: 'product-detail.html?id=fc27-1', visible: true, options: '' },
    { id: 'grand-1', category: 'grand', name: 'Ù…Ù†ØªØ¬ Grand', desc: 'Ø£Ø¶Ù ÙˆØµÙ Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', price: 0, image: 'assets/banner-mobile.png', link: 'product-detail.html?id=grand-1', visible: true, options: '' },
    { id: 'sub-1', category: 'subscriptions', name: 'Ø§Ø´ØªØ±Ø§Ùƒ Ø±Ù‚Ù…ÙŠ', desc: 'Ø£Ø¶Ù ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø§Ø´ØªØ±Ø§Ùƒ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©.', price: 0, image: 'assets/banner-mobile.png', link: 'product-detail.html?id=sub-1', visible: true, options: '' }
  ]
};

function gzLoadStore(){
  try {
    const raw = localStorage.getItem(GZ_STORE_KEY);
    if (!raw) return structuredClone(GZ_DEFAULT_STORE);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(GZ_DEFAULT_STORE),
      ...parsed,
      hero: {...GZ_DEFAULT_STORE.hero, ...(parsed.hero || {})},
      verifications: {...GZ_DEFAULT_STORE.verifications, ...(parsed.verifications || {})},
      categories: Array.isArray(parsed.categories) ? parsed.categories : GZ_DEFAULT_STORE.categories,
      products: Array.isArray(parsed.products) ? parsed.products : GZ_DEFAULT_STORE.products
    };
  } catch(e) {
    return structuredClone(GZ_DEFAULT_STORE);
  }
}
function gzSaveStore(store){ localStorage.setItem(GZ_STORE_KEY, JSON.stringify(store)); }
function gzMoney(v){ const n = Number(v || 0); return n > 0 ? `${n.toFixed(0)} Ø±.Ø³` : 'Ø­Ø¯Ø¯ Ø§Ù„Ø³Ø¹Ø±'; }
function gzCategoryName(store, id){ return (store.categories.find(c=>c.id===id)||{}).name || id; }
function gzEscape(s){ return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

function gzInitMarketplace(){
  const catWrap = document.getElementById('categoryBanners');
  const productsGrid = document.getElementById('productsGrid');
  if (!catWrap && !productsGrid) return;
  const store = gzLoadStore();
  const logo = document.getElementById('siteLogoImg');
  const heroImg = document.getElementById('heroBannerImg');
  const heroLink = document.getElementById('mainHeroBanner');
  if (logo) logo.src = 'assets/khatafah-wordmark.png';
  if (heroImg) heroImg.src = store.hero.image || 'assets/banner.png';
  if (heroLink) heroLink.href = store.hero.link || '#products';
  const ht = document.getElementById('heroBannerTitle'); if (ht) ht.textContent = store.hero.title;
  const hs = document.getElementById('heroBannerSubtitle'); if (hs) hs.textContent = store.hero.subtitle;
  const fd = document.getElementById('freelanceDocText'); if (fd) fd.textContent = store.verifications.freelance || '';
  const bv = document.getElementById('businessVerifyText'); if (bv) bv.textContent = store.verifications.business || '';

  if (catWrap) {
    catWrap.innerHTML = store.categories.filter(c=>c.visible).map(cat => `
      <a class="category-card" href="${gzEscape(cat.link || ('category.html?cat='+cat.id))}">
        <img src="${gzEscape(cat.image)}" alt="${gzEscape(cat.name)}">
        <div class="category-content">
          <h3>${gzEscape(cat.name)}</h3>
          <p>${gzEscape(cat.desc || '')}</p>
        </div>
      </a>
    `).join('');
  }

  const tabs = document.getElementById('filterTabs');
  if (tabs) {
    tabs.innerHTML = `<button class="active" data-filter="all">Ø§Ù„ÙƒÙ„</button>` + store.categories.filter(c=>c.visible).map(c=>`<button data-filter="${gzEscape(c.id)}">${gzEscape(c.name)}</button>`).join('');
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      tabs.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      gzRenderProducts(store, btn.dataset.filter);
    });
  }
  gzRenderProducts(store, 'all');
  gzInitSearch(store);
  gzInitLogin();
}

function gzRenderProducts(store, filter='all'){
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  const items = store.products.filter(p => p.visible && (filter === 'all' || p.category === filter));
  productsGrid.innerHTML = items.map(p => `
    <article class="store-product-card">
      <div class="product-thumb"><img src="${gzEscape(p.image)}" alt="${gzEscape(p.name)}"></div>
      <div class="product-info">
        <small>${gzEscape(gzCategoryName(store, p.category))}</small>
        <h3>${gzEscape(p.name)}</h3>
        <p>${gzEscape(p.desc || '')}</p>
        <div class="product-price">${gzMoney(p.price)}</div>
        <div class="product-actions">
          <a class="btn btn-secondary" href="${gzEscape(p.link || ('product-detail.html?id='+p.id))}">Ø§Ù„ØªÙØ§ØµÙŠÙ„</a>
          <button class="btn btn-primary" type="button" data-add-product="${gzEscape(p.id)}">Ø¥Ø¶Ø§ÙØ© Ù„Ù„Ø³Ù„Ø©</button>
        </div>
      </div>
    </article>
  `).join('') || `<p class="small-muted">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ù†ØªØ¬Ø§Øª Ø¸Ø§Ù‡Ø±Ø© ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù‚Ø³Ù….</p>`;

  productsGrid.querySelectorAll('[data-add-product]').forEach(btn => {
    btn.addEventListener('click', () => gzAddSimpleProduct(btn.dataset.addProduct));
  });
}

function gzAddSimpleProduct(id){
  const store = gzLoadStore();
  const p = store.products.find(x=>x.id===id);
  if (!p) return;
  const cart = JSON.parse(localStorage.getItem('gz_cart') || '[]');
  cart.push({
    service: p.name,
    service_name: p.name,
    total_price: Number(p.price || 0),
    price: Number(p.price || 0),
    image: p.image,
    category: p.category,
    created_at: new Date().toISOString()
  });
  localStorage.setItem('gz_cart', JSON.stringify(cart));
  if (typeof initCartBadge === 'function') initCartBadge();
  alert('ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬ Ù„Ù„Ø³Ù„Ø©');
}

function gzInitSearch(store){
  const open = document.getElementById('openSearch');
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('storeSearchInput');
  const results = document.getElementById('searchResults');
  if (!open || !modal || !input || !results) return;
  open.addEventListener('click', () => { modal.classList.add('open'); input.focus(); });
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const items = store.products.filter(p => p.visible && (!q || (p.name+p.desc+gzCategoryName(store,p.category)).toLowerCase().includes(q)));
    results.innerHTML = items.slice(0,8).map(p => `
      <a class="search-result-item" href="${gzEscape(p.link || ('product-detail.html?id='+p.id))}">
        <img src="${gzEscape(p.image)}" alt="">
        <span><strong>${gzEscape(p.name)}</strong><br><small>${gzMoney(p.price)}</small></span>
      </a>
    `).join('');
  });
  input.dispatchEvent(new Event('input'));
}

function gzInitLogin(){
  const open = document.getElementById('openLogin');
  const modal = document.getElementById('loginModal');
  if (!open || !modal) return;
  open.addEventListener('click', () => modal.classList.add('open'));
  let lastOtp = '';
  const msg = document.getElementById('loginMsg');
  document.getElementById('sendOtpBtn')?.addEventListener('click', () => {
    lastOtp = String(Math.floor(100000 + Math.random()*900000));
    msg.textContent = 'ÙƒÙˆØ¯ Ø§Ù„ØªØ¬Ø±Ø¨Ø©: ' + lastOtp + ' â€” Ù„Ù„Ø±Ø¨Ø· Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠ ØªØ­ØªØ§Ø¬ SMS/Email API.';
  });
  document.getElementById('verifyOtpBtn')?.addEventListener('click', () => {
    const code = document.getElementById('otpCode').value.trim();
    if (code !== lastOtp) { msg.textContent = 'Ø§Ù„ÙƒÙˆØ¯ ØºÙŠØ± ØµØ­ÙŠØ­.'; return; }
    const user = { phone: document.getElementById('loginPhone').value, email: document.getElementById('loginEmail').value, verifiedAt: new Date().toISOString() };
    localStorage.setItem(GZ_USER_KEY, JSON.stringify(user));
    msg.textContent = 'ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ù†Ø¬Ø§Ø­.';
  });
}

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close-modal]')) e.target.closest('.modal')?.classList.remove('open');
  if (e.target.classList?.contains('modal')) e.target.classList.remove('open');
});

function gzInitCategoryPage(){
  const holder = document.getElementById('categoryPageContent');
  if (!holder) return;
  const store = gzLoadStore();
  const catId = new URLSearchParams(location.search).get('cat') || 'fc27';
  const cat = store.categories.find(c=>c.id===catId);
  if (!cat) { holder.innerHTML = '<p>Ø§Ù„Ù‚Ø³Ù… ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.</p>'; return; }
  document.title = cat.name + ' | Game Zoom';
  holder.innerHTML = `
    <section class="page-header">
      <div class="container">
        <div class="breadcrumb"><a href="index.html">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</a><span>â€º</span><span>${gzEscape(cat.name)}</span></div>
        <h1>${gzEscape(cat.name)}</h1>
        <p>${gzEscape(cat.desc || '')}</p>
      </div>
    </section>
    <section class="section"><div class="container"><div class="products-grid" id="productsGrid"></div></div></section>`;
  gzRenderProducts(store, catId);
}

function gzInitProductDetailPage(){
  const holder = document.getElementById('productDetailContent');
  if (!holder) return;
  const store = gzLoadStore();
  const id = new URLSearchParams(location.search).get('id');
  const p = store.products.find(x=>x.id===id);
  if (!p) { holder.innerHTML = '<section class="section"><div class="container"><p>Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯.</p></div></section>'; return; }
  document.title = p.name + ' | Game Zoom';
  holder.innerHTML = `
    <section class="page-header"><div class="container"><div class="breadcrumb"><a href="index.html">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</a><span>â€º</span><a href="category.html?cat=${gzEscape(p.category)}">${gzEscape(gzCategoryName(store,p.category))}</a><span>â€º</span><span>${gzEscape(p.name)}</span></div><h1>${gzEscape(p.name)}</h1><p>${gzEscape(p.desc || '')}</p></div></section>
    <section class="section"><div class="container"><div class="verify-card" style="display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start"><img src="${gzEscape(p.image)}" style="width:100%;border-radius:20px;max-height:420px;object-fit:cover"><div><h2>${gzEscape(p.name)}</h2><p>${gzEscape(p.desc || '')}</p><p class="product-price">${gzMoney(p.price)}</p><p class="small-muted">Ø§Ù„Ø®ÙŠØ§Ø±Ø§Øª: ${gzEscape(p.options || 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø®ÙŠØ§Ø±Ø§Øª')}</p><button class="btn btn-primary" data-add-product="${gzEscape(p.id)}">Ø¥Ø¶Ø§ÙØ© Ù„Ù„Ø³Ù„Ø©</button></div></div></div></section>`;
  holder.querySelector('[data-add-product]')?.addEventListener('click', () => gzAddSimpleProduct(p.id));
}

document.addEventListener('DOMContentLoaded', () => {
  gzInitMarketplace();
  gzInitCategoryPage();
  gzInitProductDetailPage();
});