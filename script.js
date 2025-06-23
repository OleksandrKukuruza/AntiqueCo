// Форматування ціни
function formatPrice(price) {
  const numStr = Math.floor(price).toString();
  const decimalPart = price % 1 !== 0 ? price.toFixed(2).split('.')[1] : null;
  const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

// Оновлення кількості товарів у кошику
function updateCartCount() {
  const userEmail = localStorage.getItem('userEmail');
  const cartKey = userEmail ? `cart_${userEmail}` : null;
  const cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountElement = document.getElementById('cart-count');

  if (cartCountElement) {
    cartCountElement.textContent = count;
    cartCountElement.classList.toggle('d-none', count === 0);
  }
}

// Вихід користувача
function logoutUser() {
  const userEmail = localStorage.getItem("userEmail");
  if (userEmail) {
    localStorage.removeItem(`cart_${userEmail}`);
  }
  localStorage.removeItem("userEmail");
  window.location.reload();
}

// Додавання товару в кошик
function addToCart(product) {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    alert("Спочатку увійдіть до акаунту.");
    return;
  }

  const cartKey = `cart_${userEmail}`;
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const index = cart.findIndex(item => item.id === product.id);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

// DOM повністю завантажено
document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  const userEmailDisplay = document.getElementById('userEmailDisplay');
  const loginButton = document.getElementById('loginButton');
  const logoutBtn = document.getElementById('logoutBtn');

  // Статус користувача
  if (userEmail) {
    if (userEmailDisplay) userEmailDisplay.textContent = userEmail;
    if (loginButton) loginButton.classList.add('d-none');
    if (logoutBtn) logoutBtn.classList.remove('d-none');
  } else {
    if (userEmailDisplay) userEmailDisplay.textContent = 'Гість';
    if (loginButton) loginButton.classList.remove('d-none');
    if (logoutBtn) logoutBtn.classList.add('d-none');
  }

  // Подія виходу
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }

  // Вивід меню виходу при кліку на email
  if (userEmail && userEmailDisplay && logoutBtn) {
    userEmailDisplay.addEventListener('click', () => {
      logoutBtn.classList.toggle('show');
    });
  }

  // Закриття меню при кліку поза
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
      if (logoutBtn) logoutBtn.classList.remove('show');
    }
  });

  // FAQ toggle
  const toggleItems = document.querySelectorAll('.toggle-item');
  toggleItems.forEach(item => {
    item.addEventListener('click', function (e) {
      if (e.target !== this) return;
      const answer = this.querySelector('.answer');
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Оновлення кошика
  updateCartCount();
});
const productList = document.getElementById('product-list');
if (productList) {
  // Отримуємо всі товари з localStorage
  let allProducts = JSON.parse(localStorage.getItem('products')) || [];

  if (allProducts.length === 0) {
    productList.innerHTML = '<p>Товари відсутні.</p>';
  } else {
    // Функція для вибору N випадкових унікальних елементів
    function getRandomItems(arr, n) {
      const result = [];
      const taken = new Set();

      while(result.length < n && result.length < arr.length) {
        const index = Math.floor(Math.random() * arr.length);
        if (!taken.has(index)) {
          taken.add(index);
          result.push(arr[index]);
        }
      }
      return result;
    }

    // Беремо 8 випадкових товарів
    const randomProducts = getRandomItems(allProducts, 8);

    productList.innerHTML = '';

    randomProducts.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card-product', 'col-md-4', 'mb-4');

      // Якщо product.image є абсолютним шляхом або data:, можна додатково обробити — тут просто використаємо як є
      const imageUrl = product.image 
        ? (product.image.startsWith('http') || product.image.startsWith('data:') 
            ? product.image 
            : `http://localhost:3001${product.image}`)
        : 'default-image.jpg';

      card.innerHTML = `
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${product.name}" onerror="this.src='default-image.jpg'">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <div class="category mb-2">${product.category || ''}</div>
            <p class="card-text">${product.description || 'Опис відсутній'}</p>
            <strong class="mt-auto">${formatPrice(product.price)} грн</strong>
            <a href="product.html?id=${product._id || product.id}" class="btn btn-outline-secondary mt-2">Перейти до товару</a>
          </div>
        </div>
      `;

      productList.appendChild(card);
    });
  }
}
