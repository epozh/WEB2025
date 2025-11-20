// Данные товаров
const products = [
  { id: 1, name: "Футболка для бега", price: 1200 },
  { id: 2, name: "Спортивные кроссовки", price: 4500 },
  { id: 3, name: "Бутылка для воды", price: 450 },
  { id: 4, name: "Фитнес-резинки (набор)", price: 800 },
  { id: 5, name: "Спортивная сумка", price: 2200 },
  { id: 6, name: "Перчатки для тренировок", price: 600 }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM элементы
const productsContainer = document.getElementById('products');
const cartItemsEl = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const cartCountEl = document.getElementById('cartCount');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeOrderBtn = document.getElementById('closeOrderBtn');
const orderForm = document.getElementById('orderForm');
const orderModal = document.getElementById('orderModal');
const cartModal = document.getElementById('cartModal');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Инициализация
function init() {
  renderProducts();
  renderCart();
  updateCartCount();
}

// Отображение товаров
function renderProducts() {
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${product.name}</h3>
      <p class="price">${product.price} ₽</p>
      <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
    </div>
  `).join('');

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.target.dataset.id);
      addToCart(id);
    });
  });
}

// Добавление в корзину
function addToCart(id) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart();
  renderCart();
  updateCartCount();
}

// Удаление из корзины
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

// Изменение количества
function updateQuantity(id, delta) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      renderCart();
    }
  }
}

// Сохранение в localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Подсчёт общей суммы
function getTotalPrice() {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product.price * item.quantity);
  }, 0);
}

// Обновление количества товаров в шапке
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
}

// Отображение корзины
function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Корзина пуста</p>';
    totalPriceEl.textContent = '0';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong><br>
          ${product.price} ₽ × ${item.quantity}
        </div>
        <div>
          <button class="remove-btn" data-id="${item.id}">Удалить</button>
          <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
        </div>
      </div>
    `;
  }).join('');

  totalPriceEl.textContent = getTotalPrice();

  // Обработчики для кнопок и input
  document.querySelectorAll('.cart-item .remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.target.dataset.id);
      removeFromCart(id);
    });
  });

  document.querySelectorAll('.cart-item input').forEach(input => {
    input.addEventListener('change', e => {
      const id = Number(e.target.dataset.id);
      const newQty = parseInt(e.target.value) || 1;
      const item = cart.find(i => i.id === id);
      if (item) {
        const delta = newQty - item.quantity;
        updateQuantity(id, delta);
      }
    });
  });
}

// Модальные окна
function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

// Обработчики кнопок
openCartBtn.addEventListener('click', () => openModal(cartModal));
closeCartBtn.addEventListener('click', () => closeModal(cartModal));
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Корзина пуста!');
    return;
  }
  openModal(orderModal);
});
closeOrderBtn.addEventListener('click', () => closeModal(orderModal));
closeSuccessBtn.addEventListener('click', () => closeModal(successMessage));

orderForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(orderForm);
  if (formData.get('firstName') && formData.get('lastName') && formData.get('address') && formData.get('phone')) {
    closeModal(orderModal);
    openModal(successMessage);
    // Очистка корзины после заказа
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    orderForm.reset();
  }
});

// Инициализация
init();
