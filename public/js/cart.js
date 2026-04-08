function renderCart(cart) {
  const itemsContainer = document.getElementById("cart-items");
  const countElement = document.getElementById("summary-count");
  const totalElement = document.getElementById("summary-total");

  countElement.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  totalElement.textContent = formatCurrency(cart.total);

  if (cart.items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-state">
        Корзина пока пуста.
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cart.items
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image_url}" alt="${item.title}" />
          <div>
            <span class="chip">${item.category_name}</span>
            <h3>${item.title}</h3>
            <p>${item.dimensions}</p>
            <div class="quantity-controls">
              <button class="quantity-button" data-action="decrease" data-item-id="${item.id}">-</button>
              <strong>${item.quantity}</strong>
              <button class="quantity-button" data-action="increase" data-item-id="${item.id}">+</button>
            </div>
          </div>
          <div>
            <p class="price">${formatCurrency(item.line_total)}</p>
            <button class="button button-secondary remove-item-button" data-item-id="${item.id}">
              Удалить
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadCartPage() {
  const cart = await getCart();
  renderCart(cart);
  await refreshCartBadge();
}

document.addEventListener("click", async (event) => {
  const removeButton = event.target.closest(".remove-item-button");
  if (removeButton) {
    try {
      await removeCartItem(Number(removeButton.dataset.itemId));
      await loadCartPage();
    } catch (error) {
      alert(error.message);
    }
  }

  const quantityButton = event.target.closest(".quantity-button");
  if (quantityButton) {
    const itemId = Number(quantityButton.dataset.itemId);
    const action = quantityButton.dataset.action;

    try {
      const cart = await getCart();
      const currentItem = cart.items.find((item) => item.id === itemId);
      if (!currentItem) return;

      const nextQuantity =
        action === "increase" ? currentItem.quantity + 1 : currentItem.quantity - 1;

      if (nextQuantity < 1) {
        await removeCartItem(itemId);
      } else {
        await updateCartItem(itemId, nextQuantity);
      }

      await loadCartPage();
    } catch (error) {
      alert(error.message);
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadCartPage();
  } catch (error) {
    document.getElementById("cart-items").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
