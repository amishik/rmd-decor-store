document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("featured-products");
  if (!container) return;

  try {
    const products = await getProducts();
    const featured = products.slice(0, 3);
    container.innerHTML = featured.map(createProductCard).join("");
  } catch (error) {
    container.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
