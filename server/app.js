const express = require("express");
const path = require("path");
const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const { trackVisit } = require("./utils/analytics");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trackVisit);
app.use(express.static(publicPath));

// API routes.
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Page routes for cleaner URLs.
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/catalog", (_req, res) => {
  res.sendFile(path.join(publicPath, "catalog.html"));
});

app.get("/product", (_req, res) => {
  res.sendFile(path.join(publicPath, "product.html"));
});

app.get("/cart", (_req, res) => {
  res.sendFile(path.join(publicPath, "cart.html"));
});

app.get("/checkout", (_req, res) => {
  res.sendFile(path.join(publicPath, "checkout.html"));
});

app.get("/account", (_req, res) => {
  res.sendFile(path.join(publicPath, "account.html"));
});

app.get("/orders-history", (_req, res) => {
  res.sendFile(path.join(publicPath, "orders-history.html"));
});

app.get("/admin-login", (_req, res) => {
  res.sendFile(path.join(publicPath, "admin-login.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(publicPath, "admin.html"));
});

app.get("/sales-stats", (_req, res) => {
  res.sendFile(path.join(publicPath, "sales-stats.html"));
});

app.use((_req, res) => {
  res.status(404).json({ message: "Маршрут не найден." });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
