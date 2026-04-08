function renderHistoryOrders(orders) {
  const container = document.getElementById("history-orders-list");

  if (orders.length === 0) {
    container.innerHTML = `<div class="empty-state">Заказов пока нет.</div>`;
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
            <span>Адрес</span>
            <span>${order.city}, ${order.street_address}</span>
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const orders = await getUserOrders();
    renderHistoryOrders(orders);
  } catch (error) {
    document.getElementById("history-orders-list").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
