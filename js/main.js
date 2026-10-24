
let products = [];
let currentCategory = 'todos';
let currentSearch = '';


const productsContainer = document.getElementById('products-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const categoryButtonsContainer = document.getElementById('category-filters');


async function fetchProducts() {

  loadingSpinner.classList.remove('d-none');
  errorMessage.classList.add('d-none');

  try {
    const response = await fetch('./data/products.json');

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    products = await response.json();
    renderProducts(products);
  } catch (error) {
    errorMessage.textContent = 'Hubo un problema al cargar los productos. Por favor intenta de nuevo más tarde.';
    errorMessage.classList.remove('d-none');
  } finally {
    loadingSpinner.classList.add('d-none');
  }
}


function renderProducts(productsToRender) {
  productsContainer.innerHTML = '';


  if (productsToRender.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-12 text-center text-muted my-5">
        <i class="bi bi-search fs-1"></i>
        <p class="mt-2 fs-5">No se encontraron productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

 
  productsToRender.forEach((product) => {
    const { id, nombre, categoria, precio, imagen, descripcion } = product;

    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <img src="${imagen}" class="card-img-top" alt="${nombre}" loading="lazy" />
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-secondary text-uppercase">${categoria}</span>
            <span class="fs-5 fw-bold text-primary">$${precio.toLocaleString('es-AR')}</span>
          </div>
          <h5 class="card-title fw-bold text-dark">${nombre}</h5>
          <p class="card-text text-muted small flex-grow-1">${descripcion}</p>
          <button class="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center gap-2 btn-add-cart" data-id="${id}">
            <i class="bi bi-cart-plus"></i> Agregar al Carrito
          </button>
        </div>
      </div>
    `;

    productsContainer.appendChild(col);
  });
}

function applyFilters() {

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      currentCategory === 'todos' || product.categoria === currentCategory;

    const matchesSearch = product.nombre
      .toLowerCase()
      .includes(currentSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  renderProducts(filteredProducts);
}


searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value.trim();
  applyFilters();
});


categoryButtonsContainer.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;


  const buttons = categoryButtonsContainer.querySelectorAll('button');
  buttons.forEach((btn) => {
    btn.classList.remove('active-filter', 'btn-dark');
    btn.classList.add('btn-outline-dark');
  });

  e.target.classList.remove('btn-outline-dark');
  e.target.classList.add('active-filter', 'btn-dark');

  currentCategory = e.target.dataset.category;
  applyFilters();
});


productsContainer.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.btn-add-cart');
  if (!addBtn) return;

  const productId = parseInt(addBtn.dataset.id);

  const selectedProduct = products.find((item) => item.id === productId);

  if (selectedProduct) {
    addToCart(selectedProduct);
  }
});

fetchProducts();