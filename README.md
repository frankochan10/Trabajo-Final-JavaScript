TechStore

Simulador interactivo de tienda online gaming

## 🚀 Requisitos Cumplidos
- **Carga Asincrónica:** Consumo de datos desde `.json` local mediante `fetch` con `async/await`, gestionando estados con `try/catch/finally` y mensajes de error en la interfaz.
- **Manipulación Dinámica del DOM:** Renderizado dinámico de productos, filtros de categorías en tiempo real y panel lateral de carrito de compras.
- **Funciones de Orden Superior:** Uso de `find()`, `filter()`, `reduce()` y `forEach()` para búsquedas, filtros y cálculo de totales.
- **Persistencia en LocalStorage:** CRUD completo (guardar productos, modificar cantidades, eliminar items y vaciar carrito).
- **Sintaxis Moderna:** Destructuring, operadores ternarios y operador OR (`||`).
- **Librerías Externas Integradas:**
  - **Toastify JS:** Notificaciones interactivas de acciones en el carrito.
  - **SweetAlert2:** Modales de confirmación para vaciado de carrito y finalización de compra (sin alertas nativas).
  - **Bootstrap 5:** Diseño responsive, componentes y estilos.

## 🛠️ Cómo ejecutar el proyecto
Al realizar peticiones `fetch` locales para consumir el archivo `products.json`, el proyecto debe ejecutarse con un servidor local:
1. Clonar el repositorio.
2. Abrir con Visual Studio Code.
3. Ejecutar mediante **Live Server** haciendo clic derecho en `index.html` -> *Open with Live Server*.
