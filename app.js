// ===== INITIAL DATA =====
const DEFAULT_PRODUCTS = [
  {
    id: 1, name: "سماعات لاسلكية احترافية", price: 349,
    category: "إلكترونيات", emoji: "🎧",
    desc: "سماعات بلوتوث عالية الجودة مع إلغاء ضوضاء نشط وبطارية تدوم 30 ساعة. تصميم مريح للاستخدام الطويل.",
    image: "", badge: "الأكثر مبيعاً"
  },
  {
    id: 2, name: "ساعة ذكية رياضية", price: 599,
    category: "إلكترونيات", emoji: "⌚",
    desc: "ساعة ذكية متعددة الوظائف تتبع نشاطك الرياضي وقياس نبضات القلب. مقاومة للماء حتى 50 متر.",
    image: "", badge: "جديد"
  },
  {
    id: 3, name: "حقيبة جلد أصيل", price: 450,
    category: "أزياء", emoji: "👜",
    desc: "حقيبة مصنوعة من الجلد الطبيعي الأصيل بتصميم عصري أنيق. متاحة بعدة ألوان.",
    image: "", badge: ""
  },
  {
    id: 4, name: "مصباح طاولة ذكي", price: 189,
    category: "المنزل", emoji: "💡",
    desc: "مصباح LED قابل للتعتيم مع 16 مليون لون. يتحكم به عبر التطبيق أو الصوت.",
    image: "", badge: "عرض"
  },
  {
    id: 5, name: "حذاء رياضي نايك", price: 720,
    category: "أزياء", emoji: "👟",
    desc: "حذاء رياضي خفيف الوزن مثالي للجري والتمارين. مواد تهوية ممتازة ونعل مرن.",
    image: "", badge: ""
  },
  {
    id: 6, name: "ماكينة قهوة أوتوماتيك", price: 890,
    category: "المنزل", emoji: "☕",
    desc: "ماكينة قهوة متكاملة تصنع إسبريسو، كابتشينو ولاتيه بلمسة زر واحدة.",
    image: "", badge: "مميز"
  },
  {
    id: 7, name: "لعبة بلوك بناء", price: 120,
    category: "ألعاب", emoji: "🧱",
    desc: "مجموعة بلوك إبداعية لتنمية خيال الأطفال. آمنة ومصنوعة من مواد غير سامة.",
    image: "", badge: ""
  },
  {
    id: 8, name: "كتاب تطوير الذات", price: 85,
    category: "كتب", emoji: "📚",
    desc: "كتاب شامل لتحسين الإنتاجية وتطوير المهارات الشخصية، مكتوب بأسلوب سلس وعملي.",
    image: "", badge: ""
  }
];

// ===== STATE =====
let products = JSON.parse(localStorage.getItem('myshop_products')) || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('myshop_cart')) || [];
let nextId = Math.max(...products.map(p => p.id), 0) + 1;

// ===== SAVE STATE =====
function saveProducts() {
  localStorage.setItem('myshop_products', JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem('myshop_cart', JSON.stringify(cart));
  updateCartBadge();
}

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const navEl = document.getElementById('nav-' + pageId);
  if (navEl) navEl.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-render based on page
  if (pageId === 'home') renderFeatured();
  if (pageId === 'products') renderProducts();
  if (pageId === 'cart') renderCart();
  if (pageId === 'admin') renderAdmin();
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ===== RENDER PRODUCTS =====
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map(p => productCard(p)).join('');
}

function renderProducts() {
  filterProducts();
  populateCategoryFilter();
}

function populateCategoryFilter() {
  const sel = document.getElementById('categoryFilter');
  const categories = [...new Set(products.map(p => p.category))];
  const current = sel.value;
  sel.innerHTML = '<option value="">جميع الفئات</option>';
  categories.forEach(c => {
    sel.innerHTML += `<option value="${c}" ${current === c ? 'selected' : ''}>${c}</option>`;
  });
}

function filterProducts() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortSelect').value;

  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  else if (sort === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name, 'ar'));

  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('productsEmpty');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = filtered.map(p => productCard(p)).join('');
  }
}

function productCard(p) {
  const imgContent = p.image
    ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='${p.emoji || '🛍'}'" />`
    : `<span style="font-size:3.5rem">${p.emoji || '🛍'}</span>`;
  const badge = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';
  const inCart = cart.find(c => c.id === p.id);

  return `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="product-img">
        ${imgContent}
        ${badge}
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${p.price} د.م</div>
          <button class="add-to-cart-btn ${inCart ? 'added' : ''}" onclick="event.stopPropagation(); addToCart(${p.id}, this)">
            ${inCart ? '✓ في السلة' : '+ أضف'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ===== CART =====
function addToCart(id, btn) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
    if (btn) {
      btn.textContent = '✓ في السلة';
      btn.classList.add('added');
    }
  }

  saveCart();
  showToast(`✅ تمت إضافة "${product.name}" للسلة`);
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCart() {
  const itemsContainer = document.getElementById('cartItems');
  const summaryContainer = document.getElementById('cartSummary');
  const emptyDiv = document.getElementById('emptyCart');
  const countSpan = document.getElementById('cartItemCount');

  const totalQty = cart.reduce((s,c) => s + c.qty, 0);
  countSpan.textContent = totalQty;

  if (cart.length === 0) {
    itemsContainer.style.display = 'none';
    summaryContainer.style.display = 'none';
    emptyDiv.style.display = 'block';
    return;
  }

  itemsContainer.style.display = 'flex';
  summaryContainer.style.display = 'block';
  emptyDiv.style.display = 'none';

  itemsContainer.innerHTML = cart.map(item => {
    const imgContent = item.image
      ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='${item.emoji || '🛍'}'" />`
      : `<span style="font-size:1.8rem">${item.emoji || '🛍'}</span>`;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${imgContent}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} د.م / قطعة</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-total">${(item.price * item.qty).toFixed(2)} د.م</div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="حذف">🗑</button>
      </div>
    `;
  }).join('');

  const subtotal = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' د.م';
  document.getElementById('totalPrice').textContent = subtotal.toFixed(2) + ' د.م';
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id, true);
  else { saveCart(); renderCart(); }
}

function removeFromCart(id, silent) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  if (!silent) showToast('🗑 تم حذف المنتج من السلة');
}

function checkout() {
  cart = [];
  saveCart();
  renderCart();
  showToast('🎉 تم تأكيد طلبك بنجاح! شكراً لتسوقك معنا');
}

// ===== MODAL =====
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const imgContent = p.image
    ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='<span style=font-size:4rem>${p.emoji || '🛍'}</span>'" />`
    : `<span style="font-size:4.5rem">${p.emoji || '🛍'}</span>`;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img">${imgContent}</div>
    <div class="modal-category">${p.category}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-desc">${p.desc || 'لا يوجد وصف متاح.'}</div>
    <div class="modal-price">${p.price} د.م</div>
    <div class="modal-actions">
      <button class="btn btn-primary" style="flex:1" onclick="addToCart(${p.id}); closeModal()">🛒 أضف إلى السلة</button>
      <button class="btn btn-outline" onclick="closeModal()">إغلاق</button>
    </div>
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== ADMIN =====
function renderAdmin() {
  // Stats
  const totalRevenue = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat-card">
      <div class="admin-stat-icon">📦</div>
      <div>
        <div class="admin-stat-num">${products.length}</div>
        <div class="admin-stat-label">إجمالي المنتجات</div>
      </div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">🛒</div>
      <div>
        <div class="admin-stat-num">${cart.reduce((s,c) => s + c.qty, 0)}</div>
        <div class="admin-stat-label">عناصر في السلة</div>
      </div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">💰</div>
      <div>
        <div class="admin-stat-num">${totalRevenue.toFixed(0)}</div>
        <div class="admin-stat-label">قيمة السلة (د.م)</div>
      </div>
    </div>
    <div class="admin-stat-card">
      <div class="admin-stat-icon">🏷️</div>
      <div>
        <div class="admin-stat-num">${[...new Set(products.map(p => p.category))].length}</div>
        <div class="admin-stat-label">الفئات</div>
      </div>
    </div>
  `;

  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById('adminProductsList');
  if (products.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:30px">لا توجد منتجات بعد</p>';
    return;
  }
  list.innerHTML = products.map(p => {
    const thumb = p.image
      ? `<img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='<span style=font-size:1.4rem>${p.emoji||'🛍'}</span>'" />`
      : `<span style="font-size:1.4rem">${p.emoji || '🛍'}</span>`;
    return `
      <div class="admin-product-item">
        <div class="admin-product-thumb">${thumb}</div>
        <div class="admin-product-info">
          <div class="admin-product-name">${p.name}</div>
          <div class="admin-product-price">${p.price} د.م · ${p.category}</div>
        </div>
        <div class="admin-actions">
          <button class="edit-btn" onclick="editProduct(${p.id})">✏️ تعديل</button>
          <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑 حذف</button>
        </div>
      </div>
    `;
  }).join('');
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('editProductId').value;
  const data = {
    name: document.getElementById('prodName').value.trim(),
    price: parseFloat(document.getElementById('prodPrice').value),
    category: document.getElementById('prodCategory').value.trim(),
    desc: document.getElementById('prodDesc').value.trim(),
    image: document.getElementById('prodImage').value.trim(),
    emoji: document.getElementById('prodEmoji').value.trim() || '🛍',
    badge: ''
  };

  if (id) {
    // Edit
    const idx = products.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) products[idx] = { ...products[idx], ...data };
    showToast('✏️ تم تحديث المنتج بنجاح');
  } else {
    // Add
    products.push({ id: nextId++, ...data });
    showToast('✅ تمت إضافة المنتج بنجاح');
  }

  saveProducts();
  resetAdminForm();
  renderAdminList();
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('editProductId').value = p.id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodCategory').value = p.category;
  document.getElementById('prodDesc').value = p.desc || '';
  document.getElementById('prodImage').value = p.image || '';
  document.getElementById('prodEmoji').value = p.emoji || '';
  document.getElementById('formTitle').textContent = '✏️ تعديل المنتج';
  document.getElementById('saveBtn').textContent = 'حفظ التعديلات ✓';

  document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
  products = products.filter(p => p.id !== id);
  cart = cart.filter(c => c.id !== id);
  saveProducts();
  saveCart();
  renderAdmin();
  showToast('🗑 تم حذف المنتج');
}

function resetAdminForm() {
  document.getElementById('editProductId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodCategory').value = '';
  document.getElementById('prodDesc').value = '';
  document.getElementById('prodImage').value = '';
  document.getElementById('prodEmoji').value = '';
  document.getElementById('formTitle').textContent = '➕ إضافة منتج جديد';
  document.getElementById('saveBtn').textContent = 'حفظ المنتج ✓';
}

// ===== CONTACT =====
function submitContact(e) {
  e.preventDefault();
  showToast('📨 تم إرسال رسالتك بنجاح! سنرد عليك قريباً');
  e.target.reset();
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== KEYBOARD CLOSE MODAL =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderFeatured();
});
