const DEMO_USER_ID = 1;
const ADMIN_TOKEN_KEY = "rmd_admin_token";

async function apiRequest(url, options = {}) {
  const { headers = {}, ...restOptions } = options;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...restOptions
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не удалось выполнить запрос.");
  }

  return data;
}

async function getProducts(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.append(key, value);
    }
  });

  return apiRequest(`/api/products?${query.toString()}`);
}

async function getCategories() {
  return apiRequest("/api/products/categories/all");
}

async function getProductById(id) {
  return apiRequest(`/api/products/${id}`);
}

async function getCart() {
  return apiRequest(`/api/cart?userId=${DEMO_USER_ID}`);
}

async function addToCart(productId, quantity = 1) {
  return apiRequest("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({
      userId: DEMO_USER_ID,
      productId,
      quantity
    })
  });
}

async function updateCartItem(itemId, quantity) {
  return apiRequest(`/api/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: DEMO_USER_ID,
      quantity
    })
  });
}

async function removeCartItem(itemId) {
  return apiRequest(`/api/cart/items/${itemId}?userId=${DEMO_USER_ID}`, {
    method: "DELETE"
  });
}

async function submitOrder(payload) {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      userId: DEMO_USER_ID,
      ...payload
    })
  });
}

async function getUser() {
  return apiRequest(`/api/users/${DEMO_USER_ID}`);
}

async function updateUserProfile(payload) {
  return apiRequest(`/api/users/${DEMO_USER_ID}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

async function getUserOrders() {
  return apiRequest(`/api/users/${DEMO_USER_ID}/orders`);
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminLogin(login, password) {
  return apiRequest("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ login, password })
  });
}

async function getAdminOrders() {
  return apiRequest("/api/admin/orders", {
    headers: {
      "x-admin-token": getAdminToken()
    }
  });
}

async function getAdminStats() {
  return apiRequest("/api/admin/stats", {
    headers: {
      "x-admin-token": getAdminToken()
    }
  });
}

async function getAdminVisitLog() {
  return apiRequest("/api/admin/visits", {
    headers: {
      "x-admin-token": getAdminToken()
    }
  });
}
