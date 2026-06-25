// Khatafah Store - main storefront script
const CART_KEY = 'khatafah_cart';
const REVIEWS_KEY = 'khatafah_reviews';
const FAV_KEY = 'khatafah_favorites';

const SOCIAL = [
  { key: 'whatsapp', label: 'واتساب', href: 'https://wa.me/message/WO2BHOEL77CGM1', icon: 'assets/social/whatsapp.webp' },
  { key: 'telegram', label: 'تيليجرام', href: 'https://t.me/I5TFAH', icon: 'assets/social/telegram.png' },
  { key: 'instagram', label: 'انستقرام', href: 'https://www.instagram.com/5atfah', icon: 'assets/social/instagram.png' },
  { key: 'tiktok', label: 'تيك توك', href: 'https://www.tiktok.com/@5tfah', icon: 'assets/social/tiktok.webp' },
  { key: 'haraj', label: 'حراج', href: 'https://haraj.com.sa', icon: 'assets/social/haraj.png' }
];

const CHECKOUT_PRODUCTS = {
  'star-projector': { id: 'star-projector', name: 'اضاءة النجوم والمجرات', price: 156, image: 'assets/home-product-image.jpeg', selectedOption: 'الخيار الأساسي' },
  'tv-lighting': { id: 'tv-lighting', name: 'الإنارة التفاعلية', price: 159, image: 'assets/tv-lighting-cover.jpeg', selectedOption: 'الخيار الأساسي' },
  'youtube-3m': { id: 'youtube-3m', name: 'اشتراك YouTube - 3 أشهر', price: 65, image: 'assets/store-banners/subscriptions-dark.png', selectedOption: '3 أشهر' },
  'youtube-1y': { id: 'youtube-1y', name: 'اشتراك YouTube - سنة كاملة', price: 190, image: 'assets/store-banners/subscriptions-dark.png', selectedOption: 'سنة كاملة' },
  'chatgpt-basic': { id: 'chatgpt-basic', name: 'اشتراك ChatGPT - شهري', price: 15, image: 'assets/store-banners/subscriptions-dark.png', selectedOption: 'شهري' },
  'chatgpt-vip': { id: 'chatgpt-vip', name: 'اشتراك ChatGPT - VIP', price: 30, image: 'assets/store-banners/subscriptions-dark.png', selectedOption: 'VIP شهري' },
  'gemini-yearly': { id: 'gemini-yearly', name: 'اشتراك Gemini Google - سنة', price: 150, image: 'assets/store-banners/subscriptions-dark.png', selectedOption: 'سنة كاملة' }
};

const DEFAULT_REVIEWS = [
  { name: 'أبو ناصر', text: 'وصلتني الاضاءة بسرعة، بصراحة شكل النجوم على السقف يفتح النفس.', image: 'assets/reviews/review-01.jpeg', rating: 5 },
  { name: 'نورة', text: 'التصوير يعطي شكل خرافي في الغرفة والتمرير بين الاقراص سهل جدا.', image: 'assets/reviews/review-02.jpeg', rating: 5 },
  { name: 'فيصل', text: 'الاجواء صارت اهدى واجمل، والمنتج مناسب كهدية فعلا.', image: 'assets/reviews/review-03.jpeg', rating: 5 },
  { name: 'ريم', text: 'الصورة واضحة جدا وتغطية النجوم ممتازة على السقف.', image: 'assets/reviews/review-04.jpeg', rating: 5 },
  { name: 'عبدالله', text: 'كلما غيرت القرص يتغير المشهد بشكل جميل ومرتب.', image: 'assets/reviews/review-05.jpeg', rating: 5 },
  { name: 'سارة', text: 'مظهر الاضاءة في الليل رائع ويعطي الغرفة طابع خاص.', image: 'assets/reviews/review-06.jpeg', rating: 5 }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (val) => `${Number(val || 0).toLocaleString('ar-SA')} ريال`;
const esc = (str = '') => String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function toast(message, duration = 2600) {
  const t = $('[data-toast]');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove('show'), duration);
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
  renderCart();
}

function addToCart(product, quantity = 1) {
  const items = getCart();
  const option = product.selectedOption || product.option || '';
  const existing = items.find(item => item.id === product.id && (item.option || '') === option);
  if (existing) existing.quantity += quantity;
  else items.push({ id: product.id, name: product.name, price: Number(product.price || 0), image: product.image, option, quantity });
  setCart(items);
  toast('✓ تمت الإضافة للسلة');
}

function addCheckoutProductFromUrl() {
  if (!/checkout\.html$/i.test(location.pathname.split('/').pop())) return;
  const productId = new URLSearchParams(location.search).get('product');
  const product = CHECKOUT_PRODUCTS[productId];
  if (!product) return;
  const items = getCart();
  const option = product.selectedOption || '';
  const existing = items.find(item => item.id === product.id && (item.option || '') === option);
  if (!existing) {
    items.push({ id: product.id, name: product.name, price: product.price, image: product.image, option, quantity: 1 });
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
}

function removeFromCart(index) {
  const items = getCart();
  items.splice(index, 1);
  setCart(items);
  toast('تم حذف المنتج من السلة');
}

function updateCartCount() {
  const items = getCart();
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  $$('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const container = $('[data-cart-items]');
  if (!container) return;
  const items = getCart();
  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">🛒</div>
        <h3>السلة فارغة</h3>
        <p>لم تقم بإضافة أي منتجات بعد</p>
        <a href="products.html" class="btn btn-primary">تصفح المنتجات</a>
      </div>`;
  } else {
    container.innerHTML = items.map((item, index) => `
      <div class="cart-item" style="display:flex;gap:16px;padding:16px 0;border-bottom:1px solid var(--border)">
        <img src="${esc(item.image)}" alt="${esc(item.name)}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius)" loading="lazy">
        <div style="flex:1">
          <h4 style="font-size:1rem;font-weight:700;margin-bottom:4px">${esc(item.name)}</h4>
          ${item.option ? `<p style="font-size:0.85rem;color:var(--text-secondary)">${esc(item.option)}</p>` : ''}
          <p style="font-size:0.9rem;margin-top:6px"><strong>${money(item.price)}</strong> × ${Number(item.quantity || 1)}</p>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="removeFromCart(${index})" style="flex-shrink:0">✕</button>
      </div>`).join('');
  }
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  $$('[data-cart-total]').forEach(el => { el.textContent = money(total); });
}

function getReviews() {
  try {
    const custom = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    return [...custom, ...DEFAULT_REVIEWS];
  } catch { return DEFAULT_REVIEWS; }
}

function renderReviews() {
  const container = $('[data-reviews]');
  if (!container) return;
  container.innerHTML = getReviews().map(review => `
    <div class="review-card">
      <img src="${esc(review.image)}" alt="${esc(review.name)}" loading="lazy">
      <div class="review-card-body"><strong>${esc(review.name)}</strong><div class="review-stars">${'★'.repeat(review.rating || 5)}</div><p>${esc(review.text)}</p></div>
    </div>`).join('');
}

function renderFooter() {
  const footer = $('[data-footer]');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-grid shell">
      <div class="footer-brand">
        <img src="assets/khatafah-wordmark.png" alt="خطفة ستور" style="height:40px;margin-bottom:12px">
        <p>خطفة ستور - متجر منتجات مختارة واشتراكات رقمية بتجربة طلب واضحة وآمنة.</p>
        <div class="footer-social">${SOCIAL.map(s => `<a href="${esc(s.href)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}"><img src="${esc(s.icon)}" alt="${esc(s.label)}"></a>`).join('')}</div>
        <div class="footer-payments"><img src="assets/payment-icons/mada.png" alt="mada"><img src="assets/payment-icons/visa.png" alt="visa"><img src="assets/payment-icons/mastercard.png" alt="mastercard"><img src="assets/payment-icons/apple-pay.png" alt="apple pay"><img src="assets/payment-icons/stc-pay.png" alt="stc pay"></div>
      </div>
      <div class="footer-col"><h4>روابط سريعة</h4><a href="index.html">الرئيسية</a><a href="products.html">المنتجات</a><a href="ai-subscriptions.html">الاشتراكات</a><a href="cart.html">السلة</a></div>
      <div class="footer-col"><h4>الدعم والسياسات</h4><a href="terms.html">الشروط والأحكام</a><a href="privacy.html">سياسة الخصوصية</a><a href="returns.html">سياسة الاسترجاع</a><a class="verify-badge" href="https://eauthenticate.saudibusiness.gov.sa/certificate-details/0000296352" target="_blank" rel="noopener"><img src="assets/social/saudi-center.webp" alt=""> توثيق منصة الأعمال</a></div>
    </div>
    <div class="footer-bottom shell"><span>© ${new Date().getFullYear()} خطفة ستور - جميع الحقوق محفوظة</span><span>🇸🇦 المملكة العربية السعودية</span></div>`;
}

function bindUI() {
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');
  if (menuToggle && nav) menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  const header = $('.header');
  window.addEventListener('scroll', () => { if (header) header.classList.toggle('scrolled', window.pageYOffset > 50); }, { passive: true });
  const toastEl = $('[data-toast]');
  if (toastEl) toastEl.addEventListener('click', () => toastEl.classList.remove('show'));
}

document.addEventListener('DOMContentLoaded', () => {
  addCheckoutProductFromUrl();
  updateCartCount();
  renderCart();
  renderReviews();
  renderFooter();
  bindUI();
});

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toast = toast;
