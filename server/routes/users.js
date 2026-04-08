const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `
      SELECT id, full_name, email, phone, city, street_address, created_at
      FROM users
      WHERE id = $1;
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден." });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return res.status(500).json({ message: "Не удалось получить данные пользователя." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      phone,
      city,
      streetAddress
    } = req.body;

    if (!fullName || !email || !phone || !city || !streetAddress) {
      return res.status(400).json({ message: "Заполните все поля профиля." });
    }

    const { rows } = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        phone = $3,
        city = $4,
        street_address = $5
      WHERE id = $6
      RETURNING id, full_name, email, phone, city, street_address, created_at;
      `,
      [fullName, email, phone, city, streetAddress, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден." });
    }

    return res.json({
      message: "Профиль обновлен.",
      user: rows[0]
    });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    return res.status(500).json({ message: "Не удалось обновить профиль." });
  }
});

router.get("/:id/orders", async (req, res) => {
  try {
    const userId = req.params.id;
    const ordersResult = await pool.query(
      `
      SELECT id, total_amount, status, city, street_address, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC;
      `,
      [userId]
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
    console.error("Ошибка при получении истории заказов:", error);
    return res.status(500).json({ message: "Не удалось получить историю заказов." });
  }
});

module.exports = router;
