const express = require("express");
const pool = require("../db");

const router = express.Router();

async function ensureCart(userId) {
  const existingCart = await pool.query(
    "SELECT id FROM carts WHERE user_id = $1;",
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0].id;
  }

  const newCart = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING id;",
    [userId]
  );

  return newCart.rows[0].id;
}

async function getCartPayload(userId) {
  const cartId = await ensureCart(userId);
  const itemsResult = await pool.query(
    `
    SELECT
      ci.id,
      ci.quantity,
      ci.unit_price,
      p.id AS product_id,
      p.title,
      p.image_url,
      p.dimensions,
      c.name AS category_name,
      (ci.quantity * ci.unit_price) AS line_total
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE ci.cart_id = $1
    ORDER BY ci.id ASC;
    `,
    [cartId]
  );

  const items = itemsResult.rows.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    line_total: Number(item.line_total)
  }));

  return {
    cartId,
    userId: Number(userId),
    items,
    total: items.reduce((sum, item) => sum + item.line_total, 0)
  };
}

router.get("/", async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "Не указан пользователь." });
    }

    return res.json(await getCartPayload(userId));
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    return res.status(500).json({ message: "Не удалось получить корзину." });
  }
});

router.post("/items", async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    const productId = Number(req.body.productId);
    const quantity = Math.max(1, Number(req.body.quantity || 1));

    if (!userId || !productId) {
      return res.status(400).json({ message: "Не удалось добавить товар в корзину." });
    }

    const cartId = await ensureCart(userId);
    const productResult = await pool.query(
      "SELECT price FROM products WHERE id = $1;",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Товар не найден." });
    }

    const unitPrice = productResult.rows[0].price;
    const existingItem = await pool.query(
      "SELECT id FROM cart_items WHERE cart_id = $1 AND product_id = $2;",
      [cartId, productId]
    );

    if (existingItem.rows.length > 0) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1, unit_price = $2 WHERE id = $3;",
        [quantity, unitPrice, existingItem.rows[0].id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4);
        `,
        [cartId, productId, quantity, unitPrice]
      );
    }

    await pool.query("UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1;", [cartId]);
    return res.status(201).json(await getCartPayload(userId));
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
    return res.status(500).json({ message: "Не удалось добавить товар в корзину." });
  }
});

router.put("/items/:itemId", async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    const userId = Number(req.body.userId);
    const quantity = Number(req.body.quantity);

    if (!itemId || !userId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Некорректные данные для изменения корзины." });
    }

    await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2;", [quantity, itemId]);
    return res.json(await getCartPayload(userId));
  } catch (error) {
    console.error("Ошибка при обновлении корзины:", error);
    return res.status(500).json({ message: "Не удалось обновить корзину." });
  }
});

router.delete("/items/:itemId", async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    const userId = Number(req.query.userId);

    if (!itemId || !userId) {
      return res.status(400).json({ message: "Некорректный запрос удаления." });
    }

    await pool.query("DELETE FROM cart_items WHERE id = $1;", [itemId]);
    return res.json(await getCartPayload(userId));
  } catch (error) {
    console.error("Ошибка при удалении из корзины:", error);
    return res.status(500).json({ message: "Не удалось удалить товар из корзины." });
  }
});

module.exports = router;
