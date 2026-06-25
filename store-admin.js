const ADMIN_API_BASE = location.hostname.endsWith('pages.dev') ? 'https://gamezoom-54hb.onrender.com' : '';
let adminPassword = sessionStorage.getItem('gz_admin_password') || '';
let adminData = { settings: {}, categories: [], banners: [], products: [], shop_orders: [] };

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeBackground(image = '') {
  if (!image) return 'none';
  if (image.startsWith('data:image/') || image.startsWith('assets/') || /^https?:\/\//i.test(image)) {
    return `url("${image.replaceAll('"', '%22')}")`;
  }
  return 'none';
}

async function adminApi(path, options = {}) {
  const response = await fetch(`${ADMIN_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'تعذر تنفيذ العملية');
  return result;
}

async function loadAdminData() {
  const result = await adminApi('/api/admin/storefront');
  adminData = result;
  renderAll();
}

function setDashboard(open) {
  document.getElementById('loginPanel').classList.toggle('hidden', open);
  document.getElementById('dashboard').classList.toggle('hidden', !open);
  document.getElementById('logoutBtn').classList.toggle('hidden', !open);
}

function showLoginMessage(message) {
  document.getElementById('loginMessage').textContent = message;
}

function switchTab(name) {
  document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  document.querySelectorAll('.admin-section').forEach(section => section.classList.toggle('active', section.dataset.section === name));
}

function formObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => { data[key] = value; });
  form.querySelectorAll('input[type="checkbox"][name]').forEach(input => { data[input.name] = input.checked; });
  return data;
}

function resetForm(form) {
  form.reset();
  const id = form.querySelector('[name="id"]');
  if (id) id.value = '';
  form.querySelectorAll('input[type="hidden"][name="image"]').forEach(input => { input.value = ''; });
  form.querySelectorAll('[data-image-preview]').forEach(preview => {
    preview.style.backgroundImage = 'none';
    preview.textContent = 'بدون صورة';
  });
}

function fillForm(form, item) {
  Object.entries(item).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (!input) return;
    if (input.type === 'checkbox') input.checked = Boolean(value);
    else if (key === 'options') input.value = Array.isArray(value) ? value.join('\n') : value || '';
    else input.value = value ?? '';
  });
  const image = item.image || '';
  const hiddenImage = form.elements.namedItem('image');
  if (hiddenImage) hiddenImage.value = image;
  const preview = form.querySelector('[data-image-preview]');
  if (preview) {
    preview.style.backgroundImage = safeBackground(image);
    preview.textContent = image ? '' : 'بدون صورة';
  }
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderSettings() {
  const form = document.getElementById('settingsForm');
  if (!form) return;
  Object.entries(adminData.settings || {}).forEach(([key, value]) => {
    const input = form.elements.namedItem(key);
    if (input) input.value = value || '';
  });
  const preview = form.querySelector('[data-image-preview="logo"]');
  preview.style.backgroundImage = safeBackground(adminData.settings.logo);
  preview.textContent = adminData.settings.logo ? '' : 'معاينة الشعار';
}

function renderCategories() {
  const list = document.getElementById('categoriesList');
  const options = adminData.categories.map(category => `<option value="${esc(category.slug)}">${esc(category.name)}</option>`).join('');
  document.querySelector('#productFormAdmin [name="category_slug"]').innerHTML = options;
  list.innerHTML = adminData.categories.map(category => `
    <article class="admin-item">
      <div class="admin-thumb" style="background-image:${safeBackground(category.image)}">${category.image ? '' : esc(category.name.charAt(0))}</div>
      <div><h3>${esc(category.name)}</h3><p>${esc(category.slug)} · ${esc(category.link || '')}</p><span class="admin-badge ${category.active ? '' : 'off'}">${category.active ? 'ظاهر' : 'مخفي'}</span></div>
      <div class="admin-item-actions"><button class="admin-btn small secondary" data-edit-category="${category.id}">تعديل</button><button class="admin-btn small danger" data-delete-category="${category.id}">حذف</button></div>
    </article>
  `).join('') || '<div class="admin-panel">لا توجد أقسام.</div>';
}

function renderBanners() {
  const list = document.getElementById('bannersList');
  list.innerHTML = adminData.banners.map(banner => `
    <article class="admin-item">
      <div class="admin-thumb" style="background-image:${safeBackground(banner.image)}">${banner.image ? '' : 'B'}</div>
      <div><h3>${esc(banner.title)}</h3><p>${esc(banner.subtitle || '')} · ${esc(banner.link || '')}</p><span class="admin-badge ${banner.active ? '' : 'off'}">${banner.active ? 'ظاهر' : 'مخفي'}</span></div>
      <div class="admin-item-actions"><button class="admin-btn small secondary" data-edit-banner="${banner.id}">تعديل</button><button class="admin-btn small danger" data-delete-banner="${banner.id}">حذف</button></div>
    </article>
  `).join('') || '<div class="admin-panel">لا توجد بنرات.</div>';
}

function renderProducts() {
  const list = document.getElementById('productsList');
  list.innerHTML = adminData.products.map(product => `
    <article class="admin-item">
      <div class="admin-thumb" style="background-image:${safeBackground(product.image)}">${product.image ? '' : esc(product.name.charAt(0))}</div>
      <div><h3>${esc(product.name)}</h3><p>${esc(product.category_slug)} · ${Number(product.price || 0).toLocaleString('ar-SA')} ريال ${product.external_url ? `· رابط: ${esc(product.external_url)}` : ''}</p><span class="admin-badge ${product.active ? '' : 'off'}">${product.active ? 'ظاهر' : 'مخفي'}</span></div>
      <div class="admin-item-actions"><button class="admin-btn small secondary" data-edit-product="${product.id}">تعديل</button><button class="admin-btn small danger" data-delete-product="${product.id}">حذف</button></div>
    </article>
  `).join('') || '<div class="admin-panel">لا توجد منتجات.</div>';
}

function renderOrders() {
  const list = document.getElementById('ordersList');
  list.innerHTML = adminData.shop_orders.map(order => `
    <article class="admin-order">
      <div class="admin-order-head"><div><h3>${esc(order.order_number)}</h3><p>${esc(order.customer_name)} · ${esc(order.customer_phone)} · ${Number(order.total || 0).toLocaleString('ar-SA')} ريال</p></div>
      <select data-order-status="${order.id}">
        ${['جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'].map(status => `<option ${order.status === status ? 'selected' : ''}>${status}</option>`).join('')}
      </select></div>
      <div class="admin-order-items">${(order.items || []).map(item => `${esc(item.name)} (${esc(item.option || 'بدون خيار')}) × ${item.quantity}`).join('، ')}</div>
    </article>
  `).join('') || '<div class="admin-panel">لا توجد طلبات منتجات رقمية.</div>';
}

function renderAll() {
  renderSettings();
  renderCategories();
  renderBanners();
  renderProducts();
  renderOrders();
  bindListActions();
}

function bindListActions() {
  document.querySelectorAll('[data-edit-category]').forEach(button => button.onclick = () => fillForm(document.getElementById('categoryForm'), adminData.categories.find(item => item.id === Number(button.dataset.editCategory))));
  document.querySelectorAll('[data-edit-banner]').forEach(button => button.onclick = () => fillForm(document.getElementById('bannerForm'), adminData.banners.find(item => item.id === Number(button.dataset.editBanner))));
  document.querySelectorAll('[data-edit-product]').forEach(button => button.onclick = () => fillForm(document.getElementById('productFormAdmin'), adminData.products.find(item => item.id === Number(button.dataset.editProduct))));
  document.querySelectorAll('[data-delete-category]').forEach(button => button.onclick = () => deleteItem('categories', button.dataset.deleteCategory));
  document.querySelectorAll('[data-delete-banner]').forEach(button => button.onclick = () => deleteItem('banners', button.dataset.deleteBanner));
  document.querySelectorAll('[data-delete-product]').forEach(button => button.onclick = () => deleteItem('products', button.dataset.deleteProduct));
  document.querySelectorAll('[data-order-status]').forEach(select => select.onchange = async () => {
    await adminApi(`/api/admin/store/orders/${select.dataset.orderStatus}/status`, { method: 'POST', body: JSON.stringify({ status: select.value }) });
    await loadAdminData();
  });
}

async function deleteItem(type, id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  await adminApi(`/api/admin/store/${type}/${id}`, { method: 'DELETE' });
  await loadAdminData();
}

function bindImageInputs() {
  document.querySelectorAll('[data-image-input]').forEach(input => {
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 4MB.');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const form = input.closest('form');
        const targetName = input.dataset.imageInput === 'logo' ? 'logo' : 'image';
        form.elements.namedItem(targetName).value = reader.result;
        const preview = form.querySelector(`[data-image-preview="${input.dataset.imageInput}"]`);
        preview.style.backgroundImage = safeBackground(reader.result);
        preview.textContent = '';
      };
      reader.readAsDataURL(file);
    });
  });
}

async function submitEntity(form, type) {
  const payload = formObject(form);
  if (type === 'products') payload.options = String(payload.options || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  await adminApi(`/api/admin/store/${type}`, { method: 'POST', body: JSON.stringify(payload) });
  resetForm(form);
  await loadAdminData();
}

function bindForms() {
  document.getElementById('settingsForm').addEventListener('submit', async event => {
    event.preventDefault();
    await adminApi('/api/admin/store/settings', { method: 'POST', body: JSON.stringify({ settings: formObject(event.currentTarget) }) });
    await loadAdminData();
  });
  document.getElementById('categoryForm').addEventListener('submit', async event => { event.preventDefault(); await submitEntity(event.currentTarget, 'categories'); });
  document.getElementById('bannerForm').addEventListener('submit', async event => { event.preventDefault(); await submitEntity(event.currentTarget, 'banners'); });
  document.getElementById('productFormAdmin').addEventListener('submit', async event => { event.preventDefault(); await submitEntity(event.currentTarget, 'products'); });
  document.querySelectorAll('[data-reset-form]').forEach(button => button.onclick = () => resetForm(document.getElementById(button.dataset.resetForm)));
}

document.addEventListener('DOMContentLoaded', () => {
  bindImageInputs();
  bindForms();
  document.querySelectorAll('.admin-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  document.getElementById('loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    adminPassword = document.getElementById('adminPassword').value;
    try {
      await loadAdminData();
      sessionStorage.setItem('gz_admin_password', adminPassword);
      setDashboard(true);
    } catch (error) {
      showLoginMessage(error.message);
    }
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('gz_admin_password');
    location.reload();
  });
  if (adminPassword) {
    loadAdminData().then(() => setDashboard(true)).catch(() => {
      sessionStorage.removeItem('gz_admin_password');
      setDashboard(false);
    });
  }
});