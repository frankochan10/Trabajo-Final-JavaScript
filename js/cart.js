
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];


const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');
const cartCounterElement = document.getElementById('cart-counter');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');


function saveCartToStorage() {
  localStorage.setItem('techstore_cart', JSON.stringify(cart));
}



function addToCart(product) {
  
  const { id, nombre, precio, imagen } = product;

 
  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.cantidad += 1;
  } else {
    cart.push({
      id,
      nombre,
      precio,
      imagen,
      cantidad: 1,
    });
  }

  saveCartToStorage();
  renderCart();

  
  Toastify({
    text: `"${nombre}" agregado al carrito`,
    duration: 2500,
    gravity: 'bottom',
    position: 'right',
    style: {
      background: 'linear-gradient(to right, #0d6efd, #0dcaf0)',
      borderRadius: '8px',
    },
  }).showToast();
}


function updateItemQuantity(productId, delta) {
  const product = cart.find((item) => item.id === productId);

  if (product) {
    product.cantidad += delta;

   
    if (product.cantidad <= 0) {
      removeFromCart(productId, false);
      return;
    }

    saveCartToStorage();
    renderCart();
  }
}


function removeFromCart(productId, showNotification = true) {

  cart = cart.filter((item) => item.id !== productId);

  saveCartToStorage();
  renderCart();

  if (showNotification) {
    Toastify({
      text: 'Producto eliminado del carrito',
      duration: 2000,
      gravity: 'bottom',
      position: 'right',
      style: {
        background: 'linear-gradient(to right, #dc3545, #ff6b6b)',
        borderRadius: '8px',
      },
    }).showToast();
  }
}


function clearCart() {
  if (cart.length === 0) return;

 
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se eliminarán todos los productos de tu carrito.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveCartToStorage();
      renderCart();

      Swal.fire({
        title: '¡Carrito vacío!',
        text: 'Todos los productos fueron removidos.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}


function checkout() {
  if (cart.length === 0) {
    Swal.fire({
      title: 'Carrito vacío',
      text: 'Agregá al menos un producto para finalizar tu compra.',
      icon: 'info',
      confirmButtonColor: '#0d6efd',
    });
    return;
  }

 
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);


  Swal.fire({
    title: '¡Compra confirmada!',
    html: `Gracias por tu compra en <b>TechStore</b>.<br>El total abonado fue de <b>$${total.toLocaleString('es-AR')}</b>.<br>Te enviamos el comprobante a tu email.`,
    icon: 'success',
    confirmButtonColor: '#198754',
    confirmButtonText: 'Genial',
  }).then(() => {
    cart = [];
    saveCartToStorage();
    renderCart();


    const offcanvasEl = document.getElementById('cartOffcanvas');
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
}

function renderCart() {
  cartItemsContainer.innerHTML = '';


  const isCartEmpty = cart.length === 0;

  if (isCartEmpty) {
    cartItemsContainer.innerHTML = `
      <div class="text-center text-muted my-5">
        <i class="bi bi-cart-x fs-1"></i>
        <p class="mt-2">Tu carrito está vacío.</p>
      </div>
    `;
  } else {
    
    cart.forEach((item) => {
      const { id, nombre, precio, imagen, cantidad } = item;
      const subtotal = precio * cantidad;

      const itemCard = document.createElement('div');
      itemCard.className = 'cart-item p-2 mb-2 d-flex align-items-center gap-2';

      itemCard.innerHTML = `
        <img src="${imagen}" alt="${nombre}" class="cart-item-img" />
        <div class="flex-grow-1">
          <h6 class="mb-0 fs-6 text-truncate" style="max-width: 140px;" title="${nombre}">${nombre}</h6>
          <small class="text-muted">$${precio.toLocaleString('es-AR')}</small>
          <div class="d-flex align-items-center gap-1 mt-1">
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-decrease" data-id="${id}">-</button>
            <span class="px-2 fw-semibold">${cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-increase" data-id="${id}">+</button>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold small mb-2">$${subtotal.toLocaleString('es-AR')}</div>
          <button class="btn btn-sm text-danger p-0 btn-remove" data-id="${id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      cartItemsContainer.appendChild(itemCard);
    });
  }

 
  const totalAmount = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  cartTotalElement.textContent = `$${totalAmount.toLocaleString('es-AR')}`;
  cartCounterElement.textContent = totalItems;


  checkoutBtn.disabled = isCartEmpty ? true : false;
}


cartItemsContainer.addEventListener('click', (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  const productId = parseInt(target.dataset.id);

  if (target.classList.contains('btn-increase')) {
    updateItemQuantity(productId, 1);
  } else if (target.classList.contains('btn-decrease')) {
    updateItemQuantity(productId, -1);
  } else if (target.classList.contains('btn-remove')) {
    removeFromCart(productId);
  }
});

clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkout);

renderCart();