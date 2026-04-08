const express = require("express");
const pool = require("../db");

const router = express.Router();

// POST /api/orders
// Validates checkout data, creates an order, and clears the cart.
router.post("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      userId,
      fullName,
      email,
      phone,
      city,
      streetAddress,
      notes
    } = req.body;

    if (!userId || !fullName || !email || !phone || !city || !streetAddress) {
      return res.status(400).json({ message: "Необходимо заполнить все обязательные поля оформления заказа." });
    }

    await client.query("BEGIN");

    const cartQuery = `
      SELECT ci.quantity, ci.unit_price, p.id AS product_id, p.title
      FROM carts c
      JOIN cart_items ci ON ci.cart_id = c.id
      JOIN products p ON p.id = ci.product_id
      WHERE c.user_id = $1;
    `;
    const cartItemsResult = await client.query(cartQuery, [userId]);

    if (cartItemsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Корзина пуста." });
    }

    const totalAmount = cartItemsResult.rows.reduce(
      (sum, item) => sum + Number(item.unit_price) * Number(item.quantity),
      0
    );

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (user_id, full_name, email, phone, city, street_address, notes, total_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Новый')
      RETURNING id;
      `,
      [userId, fullName, email, phone, city, streetAddress, notes || "", totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cartItemsResult.rows) {
      await client.query(
        `
        INSERT INTO order_items
        (order_id, product_id, product_title, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5);
        `,
        [orderId, item.product_id, item.title, item.quantity, item.unit_price]
      );
    }

    await client.query(
      `
      UPDATE users
      SET full_name = $1, email = $2, phone = $3, city = $4, street_address = $5
      WHERE id = $6;
      `,
      [fullName, email, phone, city, streetAddress, userId]
    );

    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1);
      `,
      [userId]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Заказ успешно оформлен.",
      orderId
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error while creating order:", error);
    return res.status(500).json({ message: "Не удалось оформить заказ." });
  } finally {
    client.release();
  }
});

module.exports = router;
