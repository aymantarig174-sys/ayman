const API_BASE = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname) ? '' : 'https://';
const CART_KEY = 'khatafah_cart';
const REVIEW_KEY = 'khatafah_reviews';
const BUSINESS_PLATFORM_URL = 'https://eauthenticate.saudibusiness.gov.sa/certificate-details/0000296352';
const SOCIAL_LINKS = [
  {
    key: 'whatsapp',
    label: 'واتساب',
    short: 'WA',
    href: 'https://wa.me/message/WO2BHOEL77CGM1',
    icon: 'assets/social/whatsapp.webp',
    hint: 'مراسلة سريعة'
  },
  {
    key: 'telegram',
    label: 'تيليقرام',
    short: 'TG',
    href: 'https://t.me/I5TFAH',
    icon: 'assets/social/telegram.png',
    hint: 'القناة الرسمية'
  },
  {
    key: 'instagram',
    label: 'إنستغرام',
    short: 'IG',
    href: 'https://www.instagram.com/5atfah?igsh=MXFnYjRkNmFpa3piZA==',
    icon: 'assets/social/instagram.png',
    hint: 'صور وعروض'
  },
  {
    key: 'tiktok',
    label: 'تيك توك',
    short: 'TT',
    href: 'https://www.tiktok.com/@5tfah?_r=1&_t=ZS-979oKL7Qmt3',
    icon: 'assets/social/tiktok.webp',
    hint: 'مقاطع سريعة'
  },
  {
    key: 'haraj',
    label: 'حراج',
    short: 'ح',
    href: 'https://haraj.com.sa/users/%D9%82%D9%80%D9%8A%D9%80%D9%85%20%D8%B2%D9%88%D9%88%D9%85/page/%D8%B1%D9%88%D8%A7%D8%A8%D8%B7%20%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84',
    icon: 'assets/social/haraj.png',
    hint: 'عروض المتجر'
  }
];
const GOOGLE_MAPS_CENTER = [24.7136, 46.6753];
const DEFAULT_REVIEWS = [
  { name: 'أبو ناصر', text: 'وصلتني الإضاءة بسرعة، بصراحة شكل النجوم على السقف يفتح النفس.', image: 'assets/reviews/review-01.jpeg' },
  { name: 'نورة', text: 'التصوير يعطي شكل خرافي في الغرفة والتمرير بين الأقراص سهل جدًا.', image: 'assets/reviews/review-02.jpeg' },
  { name: 'فيصل', text: 'الأجواء صارت أهدأ وأجمل، والمنتج مناسب كهدية فعلًا.', image: 'assets/reviews/review-03.jpeg' },
  { name: 'ريم', text: 'الصورة واضحة جدًا وتغطية النجوم ممتازة على السقف.', image: 'assets/reviews/review-04.jpeg' },
  { name: 'عبدالله', text: 'كلما غيرت القرص يتغير المشهد بشكل جميل ومرتب.', image: 'assets/reviews/review-05.jpeg' },
  { name: 'سارة', text: 'مظهر الإضاءة في الليل رائع ويعطي الغرفة طابع خاص.', image: 'assets/reviews/review-06.jpeg' },
  { name: 'مبارك', text: 'جودة المنتج ممتازة والنتيجة على الجدار والسقف مرة فخمة.', image: 'assets/reviews/review-07.jpeg' },
  { name: 'هدى', text: 'التجربة نفسها ممتعة والرسمه على السقف طالعة احترافية.', image: 'assets/reviews/review-08.jpeg' }
];
const PRODUCT_CATALOG = {
  starProjector: {
    id: 'star-projector',
    name: 'اضاءة النجوم والمجرات',
    image: 'assets/star-projector-external.png',
    coverImage: 'assets/home-product-image.jpeg',
    page: 'product.html',
    category: 'إضاءة وديكور',
    price: 156,
    options: [
      { label: '24 قرص', price: 156, image: 'assets/star-discs-24.jpg' },
      { label: '12 قرص خيار (أ)', price: 146, image: 'assets/star-discs-12.jpg' },
      { label: '12 قرص خيار (ب)', price: 132, image: 'assets/star-discs-12b.jpg' },
      { label: '10 أقراص', price: 118, image: 'assets/star-discs-6.jpg' },
      { label: '6 أقراص', price: 1, image: 'assets/star-discs-3a.jpg' },
      { label: '3 أقراص خيار (أ)', price: 1, image: 'assets/star-discs-3b.jpg' },
      { label: '3 أقراص خيار (ب)', price: 1, image: 'assets/star-discs-3c.jpg' }
    ],
    gallery: [
      { type: 'image', src: 'assets/star-discs-24.jpg', alt: 'اضاءة النجوم والمجرات - 24 قرص', label: '24 قرص' },
      { type: 'image', src: 'assets/star-discs-12.jpg', alt: 'اضاءة النجوم والمجرات - 12 قرص خيار أ', label: '12 قرص خيار (أ)' },
      { type: 'image', src: 'assets/star-discs-12b.jpg', alt: 'اضاءة النجوم والمجرات - 12 قرص خيار ب', label: '12 قرص خيار (ب)' },
      { type: 'image', src: 'assets/star-discs-6.jpg', alt: 'اضاءة النجوم والمجرات - 10 أقراص', label: '10 أقراص' },
      { type: 'image', src: 'assets/star-discs-3a.jpg', alt: 'اضاءة النجوم والمجرات - 6 أقراص', label: '6 أقراص' },
      { type: 'image', src: 'assets/star-discs-3b.jpg', alt: 'اضاءة النجوم والمجرات - 3 أقراص خيار أ', label: '3 أقراص خيار (أ)' },
      { type: 'image', src: 'assets/star-discs-3c.jpg', alt: 'اضاءة النجوم والمجرات - 3 أقراص خيار ب', label: '3 أقراص خيار (ب)' }
    ],
    searchKeywords: ['نجوم', 'مجرات', 'إضاءة', 'ديكور', 'USB', 'أقراص']
  },
  tvLighting: {
    id: 'tv-lighting',
    name: 'الإنارة التفاعلية',
    image: 'assets/tv-lighting-cover.jpeg',
    coverImage: 'assets/tv-lighting-cover.jpeg',
    page: 'tv-lighting.html',
    category: 'إضاءة وديكور',
    price: 159,
    options: [],
    gallery: [
      { type: 'video', src: 'assets/tv-lighting-demo.mp4', poster: 'assets/tv-lighting-cover.jpeg', alt: 'فيديو الإنارة التفاعلية', label: 'فيديو توضيحي' }
    ],
    searchKeywords: ['تلفزيون', 'الإنارة التفاعلية', 'تفاعلية', 'خلفية', 'RGB', 'LED', 'شاشة']
  }
};
const DEFAULT_PRODUCT_KEY = 'starProjector';
function getActiveProductKey() {
  const bodyKey = String(document.body?.dataset?.product || '').trim();
  if (bodyKey && PRODUCT_CATALOG[bodyKey]) return bodyKey;
  const pathname = location.pathname.split('/').pop().toLowerCase();
  if (pathname.includes('tv-lighting')) return 'tvLighting';
  return DEFAULT_PRODUCT_KEY;
}
function getProductByKey(key = DEFAULT_PRODUCT_KEY) {
  return PRODUCT_CATALOG[key] || PRODUCT_CATALOG[DEFAULT_PRODUCT_KEY];
}
function getVariantList(item = product) {
  return Array.isArray(item.options) && item.options.length
    ? item.options
    : [{ label: 'بدون خيار', price: Number(item.price || 0), image: item.image || item.coverImage }];
}
function normalizeGalleryItem(entry, item = product, index = 0) {
  if (!entry) {
    return {
      type: 'image',
      src: item.image || item.coverImage,
      poster: item.coverImage || item.image || '',
      alt: item.name,
      label: item.name,
    };
  }
  if (typeof entry === 'string') {
    return {
      type: 'image',
      src: entry,
      poster: entry,
      alt: `${item.name} - صورة ${index + 1}`,
      label: `صورة ${index + 1}`,
    };
  }
  return {
    type: entry.type === 'video' ? 'video' : 'image',
    src: entry.src || entry.image || item.image || item.coverImage,
    poster: entry.poster || item.coverImage || item.image || '',
    alt: entry.alt || `${item.name} - ${entry.label || (entry.type === 'video' ? 'فيديو' : 'صورة')}`,
    label: entry.label || (entry.type === 'video' ? 'فيديو' : `صورة ${index + 1}`),
  };
}
function getGalleryItems(item = product) {
  if (Array.isArray(item.gallery) && item.gallery.length) {
    return item.gallery.map((entry, index) => normalizeGalleryItem(entry, item, index));
  }
  if (Array.isArray(item.options) && item.options.length) {
    return item.options.map((option, index) => normalizeGalleryItem({
      type: 'image',
      src: option.image,
      alt: `${item.name} - ${option.label}`,
      label: option.label
    }, item, index));
  }
  return [normalizeGalleryItem(null, item, 0)];
}
let product = getProductByKey(getActiveProductKey());
let productGallery = getGalleryItems(product);
const SHIPPING_FEE = 0.1;
let selectedOption = getVariantList(product)[0];
let selectedQuantity = 1;
let currentGalleryIndex = 0;
let galleryObserver = null;
let gallerySyncLock = false;

function money(value) { return `${Number(value || 0).toLocaleString('ar-SA')} ريال`; }
function qs(selector, root = document) { return root.querySelector(selector); }
function qsa(selector, root = document) { return [...root.querySelectorAll(selector)]; }
function escapeHtml(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function mapsUrl(lat, lng) {
  return lat && lng ? `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}` : '';
}
function googleMapsPreviewUrl(lat = GOOGLE_MAPS_CENTER[0], lng = GOOGLE_MAPS_CENTER[1], zoom = 15) {
  const center = `${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
  return `https://www.google.com/maps?q=${center}&z=${zoom}&output=embed`;
}
function toast(message) {
  const el = qs('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}
function cart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  renderCart();
}
function cartTotal(items = cart()) { return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0); }
function normalizeSearchText(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();
}
function buildSearchIndex() {
  const sharedPages = [
    { type: 'page', title: 'الرئيسية', description: 'الصفحة الرئيسية وخيارات المتجر', href: 'index.html', keywords: ['الرئيسية', 'خطفة', 'الصفحة الرئيسية', 'المتجر'] },
    { type: 'page', title: 'المنتج', description: 'إضاءة النجوم والمجرات', href: 'product.html', keywords: ['منتج', 'إضاءة النجوم والمجرات', 'نجوم', 'مجرات', 'إضاءة'] },
    { type: 'page', title: 'السلة', description: 'المنتجات المختارة وسلة الطلب', href: 'cart.html', keywords: ['السلة', 'سلة', 'طلب', 'مشتريات'] },
    { type: 'page', title: 'الدفع', description: 'إتمام الطلب وتحديد الموقع', href: 'checkout.html', keywords: ['الدفع', 'الشراء', 'التوصيل', 'الموقع', 'إتمام الطلب'] },
    { type: 'page', title: 'آراء العملاء', description: 'تجارب وتقييمات العملاء', href: 'product.html#reviews', keywords: ['آراء', 'تقييمات', 'عملاء', 'تقييم', 'رأي'] },
    { type: 'service', title: 'طرق الدفع', description: 'مدى وفيزا وماستر كارد وآبل باي', href: 'checkout.html', keywords: ['دفع', 'مدى', 'فيزا', 'ماستر كارد', 'ابل باي', 'طرق الدفع'] }
  ];
  const productEntries = Object.values(PRODUCT_CATALOG).map(item => ({
    type: 'product',
    title: item.name,
    description: item.category || '',
    href: item.page,
    image: item.coverImage || item.image,
    keywords: [item.name, item.category, ...(item.searchKeywords || [])]
  }));
  const serviceEntries = SOCIAL_LINKS.map(link => ({
    type: 'service',
    title: link.label,
    description: link.hint,
    href: link.href,
    external: /^https?:\/\//i.test(link.href),
    keywords: [link.label, link.short, link.hint]
  }));
  return [...productEntries, ...sharedPages, ...serviceEntries];
}
function scoreSearchEntry(entry, queryNorm) {
  const haystack = normalizeSearchText([entry.title, entry.description, ...(entry.keywords || [])].join(' '));
  if (!haystack.includes(queryNorm)) return -1;
  let score = 100 - Math.min(60, haystack.indexOf(queryNorm));
  if (normalizeSearchText(entry.title).startsWith(queryNorm)) score += 40;
  if ((entry.keywords || []).some(keyword => normalizeSearchText(keyword).startsWith(queryNorm))) score += 20;
  return score;
}
function searchCatalog(query) {
  const queryNorm = normalizeSearchText(query);
  const entries = buildSearchIndex().filter(entry => entry.type === 'product');
  const scored = queryNorm
    ? entries
        .map(entry => ({ entry, score: scoreSearchEntry(entry, queryNorm) }))
        .filter(item => item.score >= 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.entry)
    : entries.slice(0, 6);
  return scored.slice(0, 8);
}
function ensureSearchPanel() {
  let panel = qs('[data-search-panel]');
  if (panel) return panel;
  panel = document.createElement('section');
  panel.className = 'kh-search-panel';
  panel.dataset.searchPanel = 'true';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="kh-search-head">
      <input class="kh-search-input" type="search" data-search-input placeholder="ابحث عن منتج" autocomplete="off" spellcheck="false" aria-label="ابحث عن منتج">
      <button class="kh-close kh-search-close" type="button" data-close-search>إغلاق</button>
    </div>
    <div class="kh-search-results" data-search-results></div>
  `;
  document.body.append(panel);
  return panel;
}
function ensureSearchButton() {
  const menuButton = qs('[data-open-menu]');
  const cartButton = qs('[data-open-cart]');
  if (!menuButton || !cartButton || qs('[data-open-search]')) return;
  let tools = qs('[data-header-tools]');
  if (!tools) {
    tools = document.createElement('div');
    tools.className = 'kh-header-tools';
    tools.dataset.headerTools = 'true';
    menuButton.parentNode.insertBefore(tools, menuButton);
  }
  const searchButton = document.createElement('button');
  searchButton.className = 'kh-search-btn';
  searchButton.type = 'button';
  searchButton.dataset.openSearch = 'true';
  searchButton.setAttribute('aria-label', 'بحث عن المنتجات');
  searchButton.innerHTML = '<span aria-hidden="true">🔎</span>';
  tools.append(menuButton);
  tools.append(searchButton);
}
function ensureBackButton() {
  if (qs('[data-site-back]')) return;
  const backButton = document.createElement('button');
  backButton.className = 'kh-site-back';
  backButton.type = 'button';
  backButton.dataset.siteBack = 'true';
  backButton.setAttribute('aria-label', 'رجوع');
  backButton.innerHTML = '<span aria-hidden="true">></span>';
  backButton.addEventListener('click', () => {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer && referrer.origin === location.origin) {
        history.back();
        return;
      }
    } catch {}
    location.href = 'index.html';
  });
  document.body.append(backButton);
}
function renderSearchResults(query = '') {
  const results = qs('[data-search-results]');
  if (!results) return;
  const items = searchCatalog(query);
  if (!query.trim()) {
    results.innerHTML = `
      ${items.map(item => searchResultMarkup(item)).join('')}
    `;
    return;
  }
  if (!items.length) {
    results.innerHTML = '<div class="kh-search-empty">لا توجد نتائج مطابقة.</div>';
    return;
  }
  results.innerHTML = items.map(item => searchResultMarkup(item)).join('');
}
function searchResultMarkup(item) {
  const typeLabel = 'منتج';
  return `
    <a class="kh-search-result" href="${escapeHtml(item.href)}" data-search-result data-search-type="${escapeHtml(item.type)}">
      ${item.image ? `<img class="kh-search-thumb" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">` : ''}
      <span class="kh-search-copy">
        <strong>${escapeHtml(item.title)}</strong>
      </span>
      <span class="kh-search-tag">${typeLabel}</span>
    </a>
  `;
}
function openSearchPanel(prefill = '') {
  ensureSearchPanel();
  const panel = qs('[data-search-panel]');
  if (!panel) return;
  qs('[data-menu]')?.classList.remove('is-open');
  qs('[data-cart]')?.classList.remove('is-open');
  qs('[data-backdrop]')?.classList.add('is-open');
  panel.hidden = false;
  panel.classList.add('is-open');
  document.body.classList.add('is-search-open');
  const input = qs('[data-search-input]', panel);
  if (input) {
    input.value = prefill;
    renderSearchResults(prefill);
    setTimeout(() => input.focus(), 0);
  }
}
function closeSearchPanel() {
  const panel = qs('[data-search-panel]');
  if (!panel) return;
  panel.hidden = true;
  panel.classList.remove('is-open');
  document.body.classList.remove('is-search-open');
}
function applyProductQuerySelection() {
  if (document.body.dataset.page !== 'product') return;
  const params = new URLSearchParams(location.search);
  const optionParam = params.get('option');
  const optionIndex = Number(optionParam);
  if (Number.isFinite(optionIndex) && optionIndex >= 0) {
    setGallerySelection(optionIndex, { scroll: true, behavior: 'auto' });
  }
  if (location.hash === '#reviews') {
    setTimeout(() => qs('.kh-reviews-section')?.scrollIntoView({ behavior: 'auto', block: 'start' }), 50);
  }
}
function renderSharedFooter() {
  const footerGrid = qs('.kh-footer-grid');
  if (!footerGrid) return;
  footerGrid.innerHTML = `
    <div>
      <img src="assets/khatafah-wordmark.png" alt="خطفة" class="kh-footer-logo">
      <p>خطفة ستور، منتجات مختارة بعناية وتجربة طلب واضحة وآمنة.</p>
    </div>
    <div>
      <a class="kh-verify-badge" href="${BUSINESS_PLATFORM_URL}" target="_blank" rel="noopener" aria-label="توثيق منصة الأعمال">
        <img src="assets/social/saudi-center.webp" alt="منصة الأعمال">
        <strong>توثيقنا في منصة الأعمال</strong>
      </a>
    </div>
    <div class="kh-footer-extensions">
      <section class="kh-footer-panel kh-footer-panel--compact">
        <h3>روابط التواصل</h3>
        <div class="kh-social-row" aria-label="روابط التواصل">
          ${SOCIAL_LINKS.map(link => `
            <a class="kh-social-btn kh-social-btn--${link.key}" href="${link.href}" target="_blank" rel="noopener" aria-label="${link.label}" title="${link.label}">
              <img src="${link.icon}" alt="" aria-hidden="true">
            </a>
          `).join('')}
        </div>
      </section>
      <section class="kh-footer-panel kh-footer-panel--compact">
        <h3>السياسات</h3>
        <div class="kh-policy-links">
          <a href="terms.html">سياسة المتجر</a>
          <a href="privacy.html">سياسة الخصوصية</a>
          <a href="returns.html">سياسة الاسترجاع والاستبدال والضمان</a>
        </div>
      </section>
      <section class="kh-footer-panel kh-footer-panel--compact">
        <h3>طرق الدفع</h3>
        <div class="kh-payment-row" aria-label="طرق الدفع المتاحة">
          <span class="kh-payment-btn kh-payment-btn--mada"><img src="assets/payment-icons/mada.png" alt="mada"></span>
          <span class="kh-payment-btn kh-payment-btn--mastercard"><img src="assets/payment-icons/mastercard.png" alt="Mastercard"></span>
          <span class="kh-payment-btn kh-payment-btn--visa"><img src="assets/payment-icons/visa.png" alt="Visa"></span>
          <span class="kh-payment-btn kh-payment-btn--apple"><img src="assets/payment-icons/apple-pay.png" alt="Apple Pay"></span>
        </div>
      </section>
    </div>
  `;
}
function closePanels() {
  qs('[data-menu]')?.classList.remove('is-open');
  qs('[data-cart]')?.classList.remove('is-open');
  closeSearchPanel();
  qs('[data-backdrop]')?.classList.remove('is-open');
}
function normalizeImagePath(src = '') {
  try {
    const url = new URL(src, location.href);
    return url.pathname.split('/').pop() || src;
  } catch {
    return String(src).split('/').pop() || src;
  }
}
function findGalleryIndex(src) {
  const normalized = normalizeImagePath(src);
  const index = productGallery.findIndex(item =>
    normalizeImagePath(item.src) === normalized || normalizeImagePath(item.poster || '') === normalized
  );
  return index >= 0 ? index : 0;
}
function findOptionIndexByImage(src) {
  if (!product.options.length) return -1;
  const normalized = normalizeImagePath(src);
  const exactIndex = product.options.findIndex(option => normalizeImagePath(option.image) === normalized);
  if (exactIndex >= 0) return exactIndex;
  if (normalized.includes('24')) return product.options.findIndex(option => option.label.startsWith('24'));
  if (normalized.includes('12b')) return product.options.findIndex(option => option.label.startsWith('12 قرص خيار (ب)'));
  if (normalized.includes('12')) return product.options.findIndex(option => option.label.startsWith('12 قرص خيار (أ)'));
  if (normalized.includes('6')) return product.options.findIndex(option => option.label.startsWith('10'));
  if (normalized.includes('3c')) return product.options.findIndex(option => option.label.startsWith('3 أقراص خيار (ب)'));
  if (normalized.includes('3b')) return product.options.findIndex(option => option.label.startsWith('3 أقراص خيار (أ)'));
  if (normalized.includes('3a')) return product.options.findIndex(option => option.label.startsWith('6'));
  return -1;
}
function highlightSelectedOption(index) {
  qsa('[data-option-index]').forEach(button => {
    button.classList.toggle('is-selected', Number(button.dataset.optionIndex) === index);
  });
}
function clampQuantity(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 1) return 1;
  return Math.min(99, Math.floor(number));
}
function updateQuantityDisplay() {
  const display = qs('[data-quantity-value]');
  if (display) display.textContent = String(selectedQuantity);
}
function setSelectedQuantity(value) {
  selectedQuantity = clampQuantity(value);
  updateQuantityDisplay();
}
function changeSelectedQuantity(delta) {
  setSelectedQuantity(selectedQuantity + delta);
}
function getDiscCountLabel(text = '') {
  const match = String(text).match(/\d+/);
  return match ? match[0] : '';
}
function updateDiscBadge(label = selectedOption.label) {
  const text = qs('[data-disc-count-text]');
  if (!text) return;
  if (!product.options.length) {
    text.textContent = '';
    return;
  }
  const count = getDiscCountLabel(label) || label;
  text.innerHTML = `${escapeHtml(count)} قرص`;
}
function updateGallerySlideSelection(index) {
  qsa('[data-gallery-index]').forEach(button => {
    button.classList.toggle('is-selected', Number(button.dataset.galleryIndex) === index);
  });
}
function scrollGalleryToIndex(index, behavior = 'smooth') {
  const scroller = qs('[data-product-scroller]');
  if (!scroller) return;
  const slide = qs(`[data-gallery-index="${index}"]`, scroller);
  if (!slide) return;
  gallerySyncLock = true;
  slide.scrollIntoView({ behavior, block: 'nearest', inline: 'start' });
  clearTimeout(scrollGalleryToIndex.unlockTimer);
  scrollGalleryToIndex.unlockTimer = setTimeout(() => {
    gallerySyncLock = false;
  }, behavior === 'auto' ? 0 : 380);
}
function setSelectedOption(index) {
  if (!product.options.length) return;
  const nextOption = product.options[index];
  if (!nextOption) return;
  selectedOption = nextOption;
  highlightSelectedOption(index);
  updateGallerySlideSelection(index);
  qs('[data-live-price]')?.replaceChildren(document.createTextNode(money(selectedOption.price)));
  setPriceDescriptionOptionLabel();
  updateDiscBadge();
  syncMainProductImage(selectedOption.image || product.image);
}
function setPriceDescriptionOptionLabel() {
  const labelEl = qs('[data-current-option-label]');
  if (labelEl) labelEl.textContent = product.options.length ? selectedOption.label : 'بدون خيارات';
}
function syncMainProductImage(src) {
  const mainImage = qs('[data-main-product-image]');
  if (!mainImage) return;
  mainImage.src = src || product.image;
  mainImage.alt = product.options.length ? `${product.name} - ${selectedOption.label}` : product.name;
}
function updateMapPreview(lat = GOOGLE_MAPS_CENTER[0], lng = GOOGLE_MAPS_CENTER[1]) {
  const frame = qs('[data-map-preview]');
  if (!frame) return;
  frame.src = googleMapsPreviewUrl(lat, lng, 15);
  frame.title = `خرائط Google - ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
}
function renderLightboxItem(item = productGallery[currentGalleryIndex] || productGallery[0]) {
  const stage = qs('[data-lightbox-stage]');
  if (!stage || !item) return;
  if (item.type === 'video') {
    stage.innerHTML = `
      <video class="kh-lightbox-video" src="${escapeHtml(item.src)}" poster="${escapeHtml(item.poster || '')}" controls autoplay muted playsinline></video>
    `;
    return;
  }
  stage.innerHTML = `
    <img src="${escapeHtml(item.src || product.image)}" alt="${escapeHtml(item.alt || product.name)}" data-lightbox-image>
  `;
}
function openLightbox(itemOrSrc = productGallery[currentGalleryIndex] || selectedOption.image || product.image) {
  const lightbox = qs('[data-lightbox]');
  if (!lightbox) return;
  const item = typeof itemOrSrc === 'string'
    ? productGallery[findGalleryIndex(itemOrSrc)] || { type: 'image', src: itemOrSrc, alt: product.name }
    : itemOrSrc;
  currentGalleryIndex = findGalleryIndex(item.src || item.poster || '');
  renderLightboxItem(item);
  lightbox.hidden = false;
  document.body.classList.add('is-lightbox-open');
}
function closeLightbox() {
  const lightbox = qs('[data-lightbox]');
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove('is-lightbox-open');
}
function moveLightbox(step) {
  if (!productGallery.length) return;
  currentGalleryIndex = (currentGalleryIndex + step + productGallery.length) % productGallery.length;
  setGallerySelection(currentGalleryIndex, { scroll: true, behavior: 'smooth' });
  openLightbox(productGallery[currentGalleryIndex]);
}
function setGallerySelection(index, { scroll = false, behavior = 'smooth' } = {}) {
  if (!productGallery.length) return;
  const normalizedIndex = ((index % productGallery.length) + productGallery.length) % productGallery.length;
  currentGalleryIndex = normalizedIndex;
  const nextGalleryItem = productGallery[normalizedIndex];
  if (product.options.length) {
    const nextOption = product.options[normalizedIndex];
    if (!nextOption) return;
    selectedOption = nextOption;
    highlightSelectedOption(normalizedIndex);
    qs('[data-live-price]')?.replaceChildren(document.createTextNode(money(selectedOption.price)));
    setPriceDescriptionOptionLabel();
    updateDiscBadge();
    syncMainProductImage(selectedOption.image || product.image);
  } else {
    selectedOption = getVariantList(product)[0];
    updateDiscBadge('');
    qs('[data-live-price]')?.replaceChildren(document.createTextNode(money(Number(product.price || 0))));
    setPriceDescriptionOptionLabel();
    syncMainProductImage(product.coverImage || product.image);
  }
  updateGallerySlideSelection(normalizedIndex);
  if (scroll) scrollGalleryToIndex(normalizedIndex, behavior);
  const lightbox = qs('[data-lightbox]');
  if (lightbox && !lightbox.hidden) {
    renderLightboxItem(nextGalleryItem);
  }
}
function renderOptions() {
  const target = qs('[data-options]');
  if (!target) return;
  const wrap = target.closest('.kh-choice-layout');
  if (!product.options.length) {
    target.innerHTML = '';
    if (wrap) wrap.hidden = true;
    return;
  }
  if (wrap) wrap.hidden = false;
  target.innerHTML = product.options.map((option, index) => `
    <button class="kh-option ${index === 0 ? 'is-selected' : ''}" type="button" data-option-index="${index}">
      <strong>${escapeHtml(option.label)}</strong>
    </button>
  `).join('');
  qsa('[data-option-index]', target).forEach(button => button.addEventListener('click', () => {
    const optionIndex = Number(button.dataset.optionIndex);
    setGallerySelection(optionIndex, { scroll: true, behavior: 'smooth' });
  }));
}
function renderGallery() {
  const scroller = qs('[data-product-scroller]');
  if (!scroller) return;
  scroller.innerHTML = productGallery.map((item, index) => `
    <button class="kh-product-slide ${index === 0 ? 'is-selected' : ''}" type="button" data-gallery-index="${index}" data-gallery-image="${escapeHtml(item.src)}" aria-label="عرض ${escapeHtml(item.label || item.alt || product.name)}">
      ${
        item.type === 'video'
          ? `<video src="${escapeHtml(item.src)}" poster="${escapeHtml(item.poster || '')}" muted autoplay playsinline loop preload="auto"></video><span class="kh-media-badge">فيديو</span>`
          : `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || product.name)}">`
      }
    </button>
  `).join('');
  qsa('[data-gallery-index]', scroller).forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.galleryIndex);
    setGallerySelection(index, { scroll: true, behavior: 'smooth' });
    openLightbox(productGallery[index]);
  }));
  if (galleryObserver) galleryObserver.disconnect();
  galleryObserver = new IntersectionObserver(entries => {
    if (gallerySyncLock) return;
    const activeEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!activeEntry) return;
    const index = Number(activeEntry.target.dataset.galleryIndex);
    if (!Number.isNaN(index) && index !== currentGalleryIndex) {
      setGallerySelection(index, { scroll: false });
    }
  }, {
    root: scroller,
    threshold: [0.55, 0.72, 0.9]
  });
  qsa('[data-gallery-index]', scroller).forEach(button => galleryObserver.observe(button));
}
function upsertSelectedProduct(quantity = selectedQuantity) {
  const items = cart();
  const variantLabel = selectedOption?.label || 'بدون خيار';
  const variantPrice = Number(selectedOption?.price ?? product.price ?? 0);
  const variantImage = selectedOption?.image || product.image || product.coverImage;
  const key = `${product.id}-${variantLabel}`;
  const amount = clampQuantity(quantity);
  const existing = items.find(item => item.key === key);
  if (existing) existing.quantity += amount;
  else items.push({
    key,
    id: product.id,
    name: product.name,
    option: variantLabel,
    price: variantPrice,
    quantity: amount,
    image: variantImage
  });
  saveCart(items);
  return items;
}
function addMainProduct() {
  upsertSelectedProduct(selectedQuantity);
  toast('تمت إضافة المنتج للسلة');
  qs('[data-cart]')?.classList.add('is-open');
  qs('[data-backdrop]')?.classList.add('is-open');
}
function buyNow() {
  upsertSelectedProduct(selectedQuantity);
  location.href = 'checkout.html';
}
function renderCart() {
  const items = cart();
  qsa('[data-cart-count]').forEach(el => { el.textContent = items.reduce((sum, item) => sum + item.quantity, 0); });
  const list = qs('[data-cart-items]');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div class="kh-empty">السلة فارغة. أضف المنتج أولاً.</div>';
  } else {
    list.innerHTML = items.map(item => `
      <article class="kh-cart-item">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.option || 'بدون خيار')} - الكمية ${item.quantity}</p>
          <strong>${money(item.price * item.quantity)}</strong>
        </div>
        <button class="kh-remove" type="button" data-remove="${escapeHtml(item.key)}">×</button>
      </article>
    `).join('');
  }
  qs('[data-cart-total]').textContent = money(cartTotal(items));
  renderCheckoutSummary(items);
  qsa('[data-remove]').forEach(button => button.addEventListener('click', () => {
    saveCart(cart().filter(item => item.key !== button.dataset.remove));
  }));
}
function renderCheckoutSummary(items = cart()) {
  const target = qs('[data-checkout-summary]');
  if (!target) return;
  if (!items.length) {
    target.innerHTML = `
      <div class="kh-empty">
        لا يوجد منتج جاهز للدفع الآن.
        <a class="kh-secondary kh-inline-action" href="product.html">الرجوع للمنتج</a>
      </div>
    `;
    return;
  }
  target.innerHTML = `
    <h3>ملخص الطلب</h3>
    <div class="kh-checkout-summary-list">
      ${items.map(item => `
        <article class="kh-checkout-item">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.option || 'بدون خيار')}</p>
            <span>الكمية ${Number(item.quantity || 1)} | ${money(Number(item.price || 0) * Number(item.quantity || 1))}</span>
          </div>
        </article>
      `).join('')}
    </div>
    <div class="kh-checkout-summary-total kh-checkout-summary-shipping">
      <div>
        <span>سعر التوصيل</span>
        <small class="kh-checkout-summary-note">التوصيل من 6-9 أيام</small>
      </div>
      <strong>${SHIPPING_FEE.toFixed(1)} ريال</strong>
    </div>
    <div class="kh-checkout-summary-total">
      <span>الإجمالي</span>
      <strong>${money(cartTotal(items) + SHIPPING_FEE)}</strong>
    </div>
  `;
}
function setCoords(lat, lng, message) {
  const form = qs('[data-checkout-form]');
  if (form) {
    form.elements.lat.value = Number(lat).toFixed(6);
    form.elements.lng.value = Number(lng).toFixed(6);
  }
  updateMapPreview(lat, lng);
  const status = qs('[data-location-status]');
  if (status) status.textContent = message;
}
function ensurePaymentStatus() {
  const form = qs('[data-checkout-form]');
  if (!form) return null;
  let status = qs('[data-payment-status]', form);
  if (!status) {
    status = document.createElement('div');
    status.className = 'kh-payment-status';
    status.hidden = true;
    status.dataset.paymentStatus = 'true';
    form.prepend(status);
  }
  return status;
}
function setPaymentStatus(state, title, message, orderNumber = '') {
  const status = ensurePaymentStatus();
  if (!status) return;
  status.hidden = false;
  status.className = `kh-payment-status is-${state}`;
  status.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(message)}</p>
    ${orderNumber ? `<span>رقم الطلب: ${escapeHtml(orderNumber)}</span>` : ''}
  `;
}
function clearPaymentStatus() {
  const status = qs('[data-payment-status]');
  if (!status) return;
  status.hidden = true;
  status.className = 'kh-payment-status';
  status.innerHTML = '';
}
function getConsentCheckboxes(form = qs('[data-checkout-form]')) {
  if (!form) return [];
  return [...form.querySelectorAll('[data-policy-consent] input[type="checkbox"]')];
}
function syncCheckoutConsentState() {
  const form = qs('[data-checkout-form]');
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  if (!submit) return;
  const consentCheckboxes = getConsentCheckboxes(form);
  if (!consentCheckboxes.length) return;
  const allAccepted = consentCheckboxes.every(input => input.checked);
  submit.disabled = !allAccepted;
  submit.setAttribute('aria-disabled', String(!allAccepted));
}
function syncPaymentStatusFromUrl() {
  const params = new URLSearchParams(location.search);
  const state = params.get('payment');
  const orderNumber = params.get('order') || '';
  const errorMessage = params.get('error') || '';
  if (state === 'success') {
    setPaymentStatus(
      'success',
      'تم الدفع بنجاح',
      'وصلنا طلبك بنجاح، وسيتم إرسال التفاصيل إلى بريد المتجر مع رابط الموقع الجغرافي.',
      orderNumber
    );
  } else if (state === 'failed') {
    setPaymentStatus(
      'error',
      'تعذّر إكمال الدفع',
      errorMessage || 'حصل خطأ أثناء عملية الدفع. يمكنك المحاولة مرة أخرى من نفس الصفحة.'
    );
  } else if (state === 'return') {
    setPaymentStatus(
      'info',
      'جارٍ التحقق من الدفع',
      'أبقِ هذه الصفحة مفتوحة بينما نتحقق من نتيجة العملية.'
    );
  }
}
function setCheckoutUrlState(paymentState, orderNumber = '', errorMessage = '') {
  const url = new URL(location.href);
  url.searchParams.set('payment', paymentState);
  if (orderNumber) url.searchParams.set('order', orderNumber);
  else url.searchParams.delete('order');
  if (errorMessage) url.searchParams.set('error', errorMessage);
  else url.searchParams.delete('error');
  url.hash = 'checkout';
  history.replaceState({}, '', url);
}
function locateCustomer() {
  if (!navigator.geolocation) {
    toast('المتصفح لا يدعم تحديد الموقع');
    return;
  }
  qs('[data-location-status]').textContent = 'جاري تحديد موقعك...';
  navigator.geolocation.getCurrentPosition(position => {
    const latlng = [position.coords.latitude, position.coords.longitude];
    setCoords(latlng[0], latlng[1], 'تم تحديد موقعك بنجاح');
    toast('تم تحديد الموقع');
  }, () => {
    qs('[data-location-status]').textContent = 'لم نستطع تحديد الموقع. اختره من الخريطة.';
    toast('اسمح للموقع باستخدام GPS أو اختر من الخريطة');
  });
}
async function checkout(event) {
  event.preventDefault();
  let items = cart();
  if (!items.length) {
    toast('أضف المنتج أولاً قبل الانتقال للدفع');
    location.href = 'product.html';
    return;
  }
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const submit = form.querySelector('button[type="submit"]');
  const old = submit.textContent;
  submit.disabled = true;
  submit.textContent = 'جاري تجهيز الدفع...';
  clearPaymentStatus();
  if (!String(data.lat || '').trim() || !String(data.lng || '').trim()) {
    setPaymentStatus('error', 'حدد موقع التوصيل', 'يرجى تحديد موقعك من الخريطة قبل إتمام الطلب.');
    toast('حدد موقع التوصيل من الخريطة');
    submit.disabled = false;
    submit.textContent = old;
    return;
  }
  const consentCheckboxes = getConsentCheckboxes(form);
  if (consentCheckboxes.length && !consentCheckboxes.every(input => input.checked)) {
    setPaymentStatus('error', 'الموافقة على السياسات مطلوبة', 'يرجى الموافقة على سياسة المتجر وسياسة الخصوصية وسياسة الاسترجاع قبل المتابعة.');
    toast('وافق على السياسات الثلاث أولًا');
    submit.disabled = false;
    submit.textContent = old;
    return;
  }
  const enrichedItems = items.map(item => ({
    ...item,
    delivery: {
      short_address: data.short_address,
      address_notes: data.address_notes,
      lat: data.lat,
      lng: data.lng,
      maps_url: mapsUrl(data.lat, data.lng)
    }
  }));
  try {
    const response = await fetch(`${API_BASE}/api/shop-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        short_address: data.short_address,
        address_notes: data.address_notes,
        lat: data.lat,
        lng: data.lng,
        maps_url: mapsUrl(data.lat, data.lng),
        items: enrichedItems,
        total: cartTotal(items) + SHIPPING_FEE,
        returnUrl: `${location.origin}${location.pathname}?payment=return`
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.error || 'تعذر تجهيز الدفع');
    await startPayment(result, submit, old);
  } catch (error) {
    const message = error.message || 'تعذر إرسال الطلب';
    setPaymentStatus('error', 'تعذر تجهيز الدفع', message);
    toast(message);
    submit.disabled = false;
    submit.textContent = old;
  }
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
        reject(new Error('تعذر تحميل بوابة الدفع'));
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
async function startPayment(result, submit, oldText) {
  await loadGeideaCheckoutScript(result.checkoutScript);
  if (!window.GeideaCheckout) throw new Error('بوابة الدفع غير متاحة الآن');
  const payment = new window.GeideaCheckout(async paymentResult => {
    await fetch(`${API_BASE}/api/geidea/checkout-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...paymentResult, sessionId: result.sessionId, orderNumber: result.order_number })
    }).catch(() => {});
    saveCart([]);
    setCheckoutUrlState('success', result.order_number || '');
    setPaymentStatus(
      'success',
      'تم الدفع بنجاح',
      'وصلنا طلبك بنجاح، وسيتم إرسال بيانات العميل والموقع الجغرافي إلى بريد المتجر.',
      result.order_number || ''
    );
    toast('تم تأكيد الدفع وإرسال الطلب إلى المتجر');
    submit.disabled = false;
    submit.textContent = oldText;
  }, error => {
    const message = error?.responseMessage || error?.message || 'تعذر إكمال الدفع';
    setCheckoutUrlState('failed', '', message);
    setPaymentStatus('error', 'تعذّر إكمال الدفع', message);
    toast(message);
    submit.disabled = false;
    submit.textContent = oldText;
  }, () => {
    setCheckoutUrlState('failed', '', 'تم إلغاء الدفع');
    setPaymentStatus('info', 'تم إلغاء الدفع', 'يمكنك إعادة المحاولة في أي وقت.');
    toast('تم إلغاء الدفع');
    submit.disabled = false;
    submit.textContent = oldText;
  });
  payment.startPayment(result.sessionId);
}
function renderReviews() {
  const target = qs('[data-reviews]');
  if (!target) return;
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]'); } catch {}
  const reviews = [...custom.filter(review => String(review?.name || '').trim() !== 'خطفة'), ...DEFAULT_REVIEWS];
  target.innerHTML = reviews.map(review => `
    <article class="kh-review-card">
      <img src="${escapeHtml(review.image || 'assets/star-discs-3a.jpg')}" alt="تقييم عميل">
      <div>
        <strong>${escapeHtml(review.name || 'عميل')}</strong>
        <span>★★★★★</span>
        <p>${escapeHtml(review.text || '')}</p>
      </div>
    </article>
  `).join('');
}
function bindUI() {
  qs('[data-open-menu]')?.addEventListener('click', () => { qs('[data-menu]')?.classList.add('is-open'); qs('[data-backdrop]')?.classList.add('is-open'); });
  qs('[data-close-menu]')?.addEventListener('click', closePanels);
  qs('[data-open-search]')?.addEventListener('click', () => openSearchPanel());
  qs('[data-close-search]')?.addEventListener('click', closePanels);
  qs('[data-open-cart]')?.addEventListener('click', () => { qs('[data-cart]')?.classList.add('is-open'); qs('[data-backdrop]')?.classList.add('is-open'); });
  qs('[data-close-cart]')?.addEventListener('click', closePanels);
  qs('[data-backdrop]')?.addEventListener('click', closePanels);
  qs('[data-add-main]')?.addEventListener('click', addMainProduct);
  qs('[data-buy-now]')?.addEventListener('click', buyNow);
  qs('[data-quantity-minus]')?.addEventListener('click', () => changeSelectedQuantity(-1));
  qs('[data-quantity-plus]')?.addEventListener('click', () => changeSelectedQuantity(1));
  qs('[data-locate]')?.addEventListener('click', locateCustomer);
  qs('[data-policy-consent]')?.addEventListener('change', syncCheckoutConsentState);
  qs('[data-checkout-form]')?.addEventListener('submit', checkout);
  qs('[data-go-checkout]')?.addEventListener('click', closePanels);
  qs('[data-open-lightbox]')?.addEventListener('click', () => openLightbox(productGallery[currentGalleryIndex] || selectedOption.image));
  qs('[data-product-prev]')?.addEventListener('click', () => moveLightbox(-1));
  qs('[data-product-next]')?.addEventListener('click', () => moveLightbox(1));
  qs('[data-lightbox-close]')?.addEventListener('click', closeLightbox);
  qs('[data-lightbox-prev]')?.addEventListener('click', () => moveLightbox(-1));
  qs('[data-lightbox-next]')?.addEventListener('click', () => moveLightbox(1));
  qs('[data-lightbox]')?.addEventListener('click', event => {
    if (event.target === event.currentTarget) closeLightbox();
  });
  qs('[data-search-input]')?.addEventListener('input', event => renderSearchResults(event.target.value));
  qs('[data-search-results]')?.addEventListener('click', event => {
    if (event.target.closest('[data-search-result]')) closePanels();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearchPanel();
      return;
    }
    if (!qs('[data-search-panel]')?.hidden && event.key === 'Escape') {
      closePanels();
      return;
    }
    if (qs('[data-lightbox]')?.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') moveLightbox(1);
    if (event.key === 'ArrowRight') moveLightbox(-1);
  });
  qsa('a[href^="#"]').forEach(link => link.addEventListener('click', () => setTimeout(closePanels, 50)));
}
document.addEventListener('DOMContentLoaded', () => {
  ensureSearchButton();
  ensureBackButton();
  ensureSearchPanel();
  renderSharedFooter();
  document.body.classList.toggle('kh-no-options', !product.options.length);
  renderOptions();
  renderGallery();
  setGallerySelection(0, { scroll: true, behavior: 'auto' });
  setSelectedQuantity(1);
  renderReviews();
  renderCart();
  applyProductQuerySelection();
  renderSearchResults();
  bindUI();
  syncCheckoutConsentState();
  syncPaymentStatusFromUrl();
  updateMapPreview();
});

// ===== CART FIX (minimal safe patch) =====
function addToCart(item) {
  const items = cart();
  const existing = items.find(i => i.id === item.id && i.option === item.option);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
  } else {
    items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      option: item.option || 'default',
      quantity: item.quantity || 1
    });
  }
  saveCart(items);
  toast('تمت إضافة المنتج للسلة');
}

function renderCart() {
  const container = document.querySelector('[data-cart-items]');
  if (!container) return;

  const items = cart();
  if (!items.length) {
    container.innerHTML = '<p>السلة فارغة</p>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <img src="${item.image || ''}" alt="">
      <div>
        <h4>${item.name}</h4>
        <p>${item.option || ''}</p>
        <p>${item.price} ريال × ${item.quantity}</p>
      </div>
    </div>
  `).join('');
}

// auto render
document.addEventListener('DOMContentLoaded', renderCart);
// ===== END CART FIX =====
