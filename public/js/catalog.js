const catalogState = {
  search: "",
  sort: "",
  category: "",
  minPrice: "",
  maxPrice: ""
};

async function loadCategories() {
  const select = document.getElementById("category-filter");
  const categories = await getCategories();

  select.innerHTML = `
    <option value="">Все категории</option>
    ${categories
      .map((category) => `<option value="${category.slug}">${category.name}</option>`)
      .join("")}
  `;
}

async function loadCatalog() {
  const grid = document.getElementById("catalog-grid");
  const summary = document.getElementById("catalog-summary");

  summary.textContent = "Загрузка товаров...";

  try {
    const products = await getProducts(catalogState);
    summary.textContent = `Найдено: ${products.length}`;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          По этим параметрам товары не найдены.
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(createProductCard).join("");
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">${error.message}</div>`;
    summary.textContent = "Ошибка загрузки";
  }
}

function bindCatalogControls() {
  document.getElementById("search-input").addEventListener("input", (event) => {
    catalogState.search = event.target.value.trim();
    loadCatalog();
  });

  document.getElementById("category-filter").addEventListener("change", (event) => {
    catalogState.category = event.target.value;
    loadCatalog();
  });

  document.getElementById("min-price").addEventListener("input", (event) => {
    catalogState.minPrice = event.target.value;
    loadCatalog();
  });

  document.getElementById("max-price").addEventListener("input", (event) => {
    catalogState.maxPrice = event.target.value;
    loadCatalog();
  });

  document.getElementById("sort-select").addEventListener("change", (event) => {
    catalogState.sort = event.target.value;
    loadCatalog();
  });

  document.getElementById("reset-filters").addEventListener("click", () => {
    Object.assign(catalogState, {
      search: "",
      sort: "",
      category: "",
      minPrice: "",
      maxPrice: ""
    });

    document.getElementById("search-input").value = "";
    document.getElementById("category-filter").value = "";
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";
    document.getElementById("sort-select").value = "";
    loadCatalog();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadCategories();
    bindCatalogControls();
    await loadCatalog();
  } catch (error) {
    document.getElementById("catalog-grid").innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
});
