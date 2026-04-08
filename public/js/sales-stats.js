function renderSalesStats(stats) {
  document.getElementById("sales-stats-grid").innerHTML = `
    <article class="feature-card">
      <h3>${stats.totalOrders}</h3>
      <p>Всего заказов</p>
    </article>
    <article class="feature-card">
      <h3>${formatCurrency(stats.totalRevenue)}</h3>
      <p>Общая выручка</p>
    </article>
    <article class="feature-card">
      <h3>${formatCurrency(stats.averageCheck)}</h3>
      <p>Средний чек</p>
    </article>
    <article class="feature-card">
      <h3>${stats.visits.totalVisits}</h3>
      <p>Переходов по сайту</p>
    </article>
    <article class="feature-card">
      <h3>${stats.visits.uniqueVisitors}</h3>
      <p>Уникальных посетителей</p>
    </article>
    <article class="feature-card">
      <h3>${stats.topProducts[0] ? stats.topProducts[0].product_title : "Нет данных"}</h3>
      <p>Лидер продаж</p>
    </article>
  `;

  document.getElementById("top-products-list").innerHTML = stats.topProducts.length > 0
    ? stats.topProducts.map((item) => `
        <div class="summary-row">
          <span>${item.product_title}</span>
          <span>${item.total_sold} шт.</span>
        </div>
      `).join("")
    : `<div class="empty-state">Нет данных о продажах.</div>`;

  document.getElementById("status-stats-list").innerHTML = stats.statusStats.length > 0
    ? stats.statusStats.map((item) => `
        <div class="summary-row">
          <span>${item.status}</span>
          <span>${item.count}</span>
        </div>
      `).join("")
    : `<div class="empty-state">Нет данных по статусам.</div>`;

  document.getElementById("visit-stats-list").innerHTML = stats.visits.pageStats.length > 0
    ? stats.visits.pageStats.map((item) => `
        <div class="summary-row">
          <span>${item.path}</span>
          <span>${item.count}</span>
        </div>
      `).join("")
    : `<div class="empty-state">Нет данных о посещениях.</div>`;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!getAdminToken()) {
    window.location.href = "/admin-login";
    return;
  }

  try {
    const stats = await getAdminStats();
    renderSalesStats(stats);
  } catch (error) {
    document.getElementById("sales-stats-grid").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
