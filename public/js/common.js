function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function showMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `form-message ${type}`.trim();
}

function createProductCard(product) {
  return `
    <article class="product-card">
      <img src="${product.image_url}" alt="${product.title}" />
      <div class="product-card-body">
        <span class="chip">${product.category_name}</span>
        <div class="product-card-top">
          <strong>${product.title}</strong>
          <span class="price">${formatCurrency(product.price)}</span>
        </div>
        <p>${product.short_description}</p>
        <div class="product-card-actions">
          <a class="button button-secondary" href="/product?id=${product.id}">Подробнее</a>
          <button class="button button-primary add-to-cart-button" data-product-id="${product.id}">
            В корзину
          </button>
        </div>
      </div>
    </article>
  `;
}

async function refreshCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  try {
    const cart = await getCart();
    const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = quantity;
  } catch (_error) {
    badge.textContent = "0";
  }
}

document.addEventListener("click", async (event) => {
  const addButton = event.target.closest(".add-to-cart-button");
  if (!addButton) return;

  const productId = Number(addButton.dataset.productId);
  addButton.disabled = true;
  addButton.textContent = "Добавляем...";

  try {
    await addToCart(productId, 1);
    await refreshCartBadge();
    addButton.textContent = "Добавлено";
    setTimeout(() => {
      addButton.disabled = false;
      addButton.textContent = "В корзину";
    }, 900);
  } catch (error) {
    addButton.disabled = false;
    addButton.textContent = "В корзину";
    alert(error.message);
  }
});

document.addEventListener("DOMContentLoaded", refreshCartBadge);
