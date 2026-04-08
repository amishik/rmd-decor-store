document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-content");
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    container.innerHTML = `<div class="empty-state">Не указан идентификатор товара.</div>`;
    return;
  }

  try {
    const product = await getProductById(productId);
    document.title = `RMD decor | ${product.title}`;

    container.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image_url}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <span class="chip">${product.category_name}</span>
        <h1>${product.title}</h1>
        <p>${product.description}</p>

        <div class="product-meta">
          <div class="product-meta-item">
            <span>Цена</span>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
          <div class="product-meta-item">
            <span>Материал</span>
            <strong>${product.material}</strong>
          </div>
          <div class="product-meta-item">
            <span>Цвет</span>
            <strong>${product.color}</strong>
          </div>
          <div class="product-meta-item">
            <span>Размеры</span>
            <strong>${product.dimensions}</strong>
          </div>
          <div class="product-meta-item">
            <span>Наличие</span>
            <strong>${product.in_stock ? "В наличии" : "Нет в наличии"}</strong>
          </div>
          <div class="product-meta-item">
            <span>Категория</span>
            <strong>${product.category_name}</strong>
          </div>
        </div>

        <div class="inline-actions">
          <button class="button button-primary add-to-cart-button" data-product-id="${product.id}">
            В корзину
          </button>
          <a class="button button-secondary" href="/cart">Открыть корзину</a>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
