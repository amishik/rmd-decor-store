const express = require("express");
const pool = require("../db");
const { getVisitStats, getVisitLogEntries } = require("../utils/analytics");

const router = express.Router();

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "rmd-admin-access";

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Требуется вход администратора." });
  }

  return next();
}

router.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.json({
      token: ADMIN_TOKEN,
      adminName: "Администратор RMD decor"
    });
  }

  return res.status(401).json({ message: "Неверный логин или пароль." });
});

router.get("/orders", requireAdmin, async (_req, res) => {
  try {
    const ordersResult = await pool.query(
      `
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.city,
        o.street_address,
        o.created_at,
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC;
      `
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `
        SELECT product_title, quantity, unit_price
        FROM order_items
        WHERE order_id = $1
        ORDER BY id ASC;
        `,
        [order.id]
      );

      orders.push({
        ...order,
        total_amount: Number(order.total_amount),
        items: itemsResult.rows.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        }))
      });
    }

    return res.json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов администратора:", error);
    return res.status(500).json({ message: "Не удалось получить список заказов." });
  }
});

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const [ordersTotal, revenueTotal, topProducts, statusStats] = await Promise.all([
      pool.query("SELECT COUNT(*) AS count FROM orders;"),
      pool.query("SELECT COALESCE(SUM(total_amount), 0) AS revenue FROM orders;"),
      pool.query(
        `
        SELECT product_title, SUM(quantity) AS total_sold
        FROM order_items
        GROUP BY product_title
        ORDER BY total_sold DESC, product_title ASC
        LIMIT 5;
        `
      ),
      pool.query(
        `
        SELECT status, COUNT(*) AS count
        FROM orders
        GROUP BY status
        ORDER BY count DESC;
        `
      )
    ]);

    const visits = getVisitStats();

    return res.json({
      totalOrders: Number(ordersTotal.rows[0].count),
      totalRevenue: Number(revenueTotal.rows[0].revenue),
      averageCheck: Number(ordersTotal.rows[0].count) > 0
        ? Number(revenueTotal.rows[0].revenue) / Number(ordersTotal.rows[0].count)
        : 0,
      topProducts: topProducts.rows.map((item) => ({
        ...item,
        total_sold: Number(item.total_sold)
      })),
      statusStats: statusStats.rows.map((item) => ({
        ...item,
        count: Number(item.count)
      })),
      visits
    });
  } catch (error) {
    console.error("Ошибка при получении статистики продаж:", error);
    return res.status(500).json({ message: "Не удалось получить статистику продаж." });
  }
});

router.get("/visits", requireAdmin, (_req, res) => {
  try {
    return res.json(getVisitLogEntries(30));
  } catch (error) {
    console.error("Ошибка при получении лога посещений:", error);
    return res.status(500).json({ message: "Не удалось получить лог посещений." });
  }
});

module.exports = router;
