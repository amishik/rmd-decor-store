function renderProfileForm(user) {
  document.getElementById("profile-full-name").value = user.full_name;
  document.getElementById("profile-email").value = user.email;
  document.getElementById("profile-phone").value = user.phone;
  document.getElementById("profile-city").value = user.city;
  document.getElementById("profile-street-address").value = user.street_address;
}

function renderOrders(orders) {
  const container = document.getElementById("orders-list");

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        Заказов пока нет.
      </div>
    `;
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div class="summary-row">
            <span>Заказ №${order.id}</span>
            <span>${order.status}</span>
          </div>
          <div class="summary-row">
            <span>Дата</span>
            <span>${new Date(order.created_at).toLocaleDateString("ru-RU")}</span>
          </div>
          <div class="summary-row">
            <span>Сумма</span>
            <span>${formatCurrency(order.total_amount)}</span>
          </div>
          <div class="order-items">
            ${order.items
              .map(
                (item) => `
                  <div class="summary-row">
                    <span>${item.product_title} x ${item.quantity}</span>
                    <span>${formatCurrency(item.unit_price * item.quantity)}</span>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function validateProfile(payload) {
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
  const form = document.getElementById("profile-form");
  const message = document.getElementById("profile-message");

  try {
    const [user, orders] = await Promise.all([getUser(), getUserOrders()]);
    renderProfileForm(user);
    renderOrders(orders);
  } catch (error) {
    document.getElementById("orders-list").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      fullName: document.getElementById("profile-full-name").value,
      email: document.getElementById("profile-email").value,
      phone: document.getElementById("profile-phone").value,
      city: document.getElementById("profile-city").value,
      streetAddress: document.getElementById("profile-street-address").value
    };

    try {
      validateProfile(payload);
      await updateUserProfile(payload);
      showMessage(message, "Профиль сохранен.", "success");
    } catch (error) {
      showMessage(message, error.message, "error");
    }
  });
});
