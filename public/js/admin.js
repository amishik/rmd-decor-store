function renderAdminOrders(orders, stats) {
  const container = document.getElementById("admin-orders-list");

  const topProductsMarkup = stats.topProducts.length > 0
    ? stats.topProducts
        .map((item) => `
          <div class="summary-row">
            <span>${item.product_title}</span>
            <span>${item.total_sold} шт.</span>
          </div>
        `)
        .join("")
    : `<div class="summary-row"><span>Нет данных</span><span>-</span></div>`;

  const visitsMarkup = stats.visits.pageStats.length > 0
    ? stats.visits.pageStats
        .slice(0, 5)
        .map((item) => `
          <div class="summary-row">
            <span>${item.path}</span>
            <span>${item.count}</span>
          </div>
        `)
        .join("")
    : `<div class="summary-row"><span>Нет данных</span><span>-</span></div>`;

  const ordersMarkup = orders.length > 0
    ? orders
        .map(
          (order) => `
            <article class="orders-card" style="margin-top: 18px;">
              <div class="summary-row">
                <span>Заказ №${order.id}</span>
                <span>${order.status}</span>
              </div>
              <div class="summary-row">
                <span>Покупатель</span>
                <span>${order.full_name}</span>
              </div>
              <div class="summary-row">
                <span>Контакты</span>
                <span>${order.email}, ${order.phone}</span>
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
        .join("")
    : `<div class="empty-state">Заказов пока нет.</div>`;

  container.innerHTML = `
    <div class="account-layout">
      <section class="orders-card">
        <h2>Топ продаж</h2>
        ${topProductsMarkup}
        <h2 style="margin-top: 22px;">Посещаемость страниц</h2>
        ${visitsMarkup}
      </section>
      <section>${ordersMarkup}</section>
    </div>
  `;
}

function renderVisitLog(entries) {
  const container = document.getElementById("visit-log-list");

  if (entries.length === 0) {
    container.innerHTML = `<div class="empty-state">Лог посещений пока пуст.</div>`;
    return;
  }

  container.innerHTML = `
    <section class="orders-card visit-log-grid">
      ${entries
        .map(
          (entry) => `
            <article class="visit-log-card">
              <div class="visit-log-top">
                <strong>${entry.path}</strong>
                <span class="chip">${entry.method}</span>
              </div>
              <div class="visit-log-meta">
                <span>${new Date(entry.timestamp).toLocaleString("ru-RU")}</span>
                <span>${entry.visitorId.slice(0, 8)}...</span>
              </div>
              <p>${(entry.userAgent || "Браузер не определен").slice(0, 80)}</p>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!getAdminToken()) {
    window.location.href = "/admin-login";
    return;
  }

  document.getElementById("admin-logout").addEventListener("click", () => {
    clearAdminToken();
    window.location.href = "/admin-login";
  });

  try {
    const [orders, stats, visits] = await Promise.all([
      getAdminOrders(),
      getAdminStats(),
      getAdminVisitLog()
    ]);
    renderAdminOrders(orders, stats);
    renderVisitLog(visits);
  } catch (error) {
    clearAdminToken();
    document.getElementById("admin-orders-list").innerHTML = `<div class="empty-state">${error.message}</div>`;
    document.getElementById("visit-log-list").innerHTML = "";
  }
});
