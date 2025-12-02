// Данные товаров
const products = [
    { id: 1, name: "Футболка Nike", price: 1500, img: "👕" },
    { id: 2, name: "Кроссовки Adidas", price: 6000, img: "👟" },
    { id: 3, name: "Спортивные штаны", price: 2500, img: "👖" },
    { id: 4, name: "Рюкзак Puma", price: 3500, img: "🎒" },
    { id: 5, name: "Фитнес-браслет", price: 4000, img: "⌚" },
    { id: 6, name: "Мяч для баскетбола", price: 2000, img: "🏀" },
  ];
  
  // DOM элементы
  const catalogEl = document.getElementById('catalog');
  const cartItemsEl = document.getElementById('cartItems');
  const totalPriceEl = document.getElementById('totalPrice');
  const cartCountEl = document.getElementById('cartCount');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const orderForm = document.getElementById('orderForm');
  const cancelOrderBtn = document.getElementById('cancelOrderBtn');
  const orderFormEl = document.getElementById('orderFormEl');
  const messageEl = document.getElementById('message');
  
  // Инициализация корзины
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Функция обновления корзины в localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }
  
  // Отображение каталога
  function renderCatalog() {
    catalogEl.innerHTML = products.map(p => `
      <div class="product-card">
        <div>${p.img}</div>
        <h3>${p.name}</h3>
        <p>${p.price} ₽</p>
        <button class="add-to-cart" data-id="${p.id}">Добавить в корзину</button>
      </div>
    `).join('');
  }
  
  // Обновление UI корзины
  function updateCartUI() {
    let total = 0;
    let count = 0;
    cartItemsEl.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      count += item.quantity;
      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong> × ${item.quantity}
          </div>
          <div>
            <div class="quantity-controls">
              <button class="dec" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="inc" data-id="${item.id}">+</button>
            </div>
            <button class="remove" data-id="${item.id}">Удалить</button>
          </div>
        </div>
      `;
    }).join('') || '<p>Корзина пуста</p>';
  
    totalPriceEl.textContent = total;
    cartCountEl.textContent = count;
  }
  
  // Обработчики событий
  document.addEventListener('click', (e) => {
    // Добавление в корзину
    if (e.target.classList.contains('add-to-cart')) {
      const id = +e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.quantity++;
      } else {
        cart.push({ id, quantity: 1 });
      }
      saveCart();
    }
  
    // Удаление из корзины
    if (e.target.classList.contains('remove')) {
      const id = +e.target.dataset.id;
      cart = cart.filter(i => i.id !== id);
      saveCart();
    }
  
    // Изменение количества
    if (e.target.classList.contains('inc')) {
      const id = +e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) item.quantity++;
      saveCart();
    }
    if (e.target.classList.contains('dec')) {
      const id = +e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity--;
        saveCart();
      } else if (item && item.quantity === 1) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
      }
    }
  
    // Открытие/закрытие корзины
    if (e.target === openCartBtn || e.target === closeCartBtn || e.target.closest('.cart-modal')) {
      if (e.target === openCartBtn) cartModal.classList.remove('hidden');
      if (e.target === closeCartBtn || !e.target.closest('.cart-content')) {
        cartModal.classList.add('hidden');
      }
    }
  
    // Открытие формы заказа
    if (e.target === checkoutBtn) {
      cartModal.classList.add('hidden');
      orderForm.classList.remove('hidden');
    }
  
    // Отмена заказа
    if (e.target === cancelOrderBtn) {
      orderForm.classList.add('hidden');
    }
  });
  
  // Отправка формы
  orderFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    orderForm.classList.add('hidden');
    messageEl.classList.remove('hidden');
    setTimeout(() => {
      messageEl.classList.add('hidden');
      cart = [];
      saveCart();
    }, 3000);
  });
  
  // Инициализация
  renderCatalog();
  updateCartUI();