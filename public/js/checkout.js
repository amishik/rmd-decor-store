async function renderCheckoutSummary() {
  const cart = await getCart();
  const summary = document.getElementById("checkout-summary");

  if (cart.items.length === 0) {
    summary.innerHTML = `
      <div class="empty-state">
        Корзина пуста.
      </div>
    `;
    return;
  }

  summary.innerHTML = `
    ${cart.items
      .map(
        (item) => `
          <div class="summary-row">
            <span>${item.title} x ${item.quantity}</span>
            <span>${formatCurrency(item.line_total)}</span>
          </div>
        `
      )
      .join("")}
    <div class="summary-row total-row">
      <span>Итого</span>
      <span>${formatCurrency(cart.total)}</span>
    </div>
  `;
}

async function fillUserData() {
  const user = await getUser();
  document.getElementById("full-name").value = user.full_name;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phone;
  document.getElementById("city").value = user.city;
  document.getElementById("street-address").value = user.street_address;
}

function validateCheckoutForm(payload) {
  if (payload.fullName.trim().length < 3) {
    throw new Error("Введите корректное ФИО.");
  }

  if (!payload.email.includes("@")) {
    throw new Error("Введите корректный email.");
  }

  if (payload.phone.trim().length < 6) {
    throw new Error("Введите корректный телефон.");
  }

  if (payload.city.trim().length < 2 || payload.streetAddress.trim().length < 5) {
    throw new Error("Введите корректный адрес.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await Promise.all([renderCheckoutSummary(), fillUserData()]);
  } catch (error) {
    document.getElementById("checkout-summary").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }

  const form = document.getElementById("checkout-form");
  const message = document.getElementById("checkout-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      fullName: document.getElementById("full-name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      city: document.getElementById("city").value,
      streetAddress: document.getElementById("street-address").value,
      notes: document.getElementById("notes").value
    };

    try {
      validateCheckoutForm(payload);
      const result = await submitOrder(payload);
      showMessage(message, `Заказ №${result.orderId} оформлен.`, "success");
      form.reset();
      await renderCheckoutSummary();
      await refreshCartBadge();
      setTimeout(() => {
        window.location.href = "/account";
      }, 1200);
    } catch (error) {
      showMessage(message, error.message, "error");
    }
  });
});
