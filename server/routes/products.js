const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, sort, category, minPrice, maxPrice } = req.query;
    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`p.title ILIKE $${values.length}`);
    }

    if (category) {
      values.push(category);
      conditions.push(`c.slug = $${values.length}`);
    }

    if (minPrice) {
      values.push(Number(minPrice));
      conditions.push(`p.price >= $${values.length}`);
    }

    if (maxPrice) {
      values.push(Number(maxPrice));
      conditions.push(`p.price <= $${values.length}`);
    }

    let orderBy = "p.id ASC";
    if (sort === "price-asc") orderBy = "p.price ASC";
    if (sort === "price-desc") orderBy = "p.price DESC";
    if (sort === "name-asc") orderBy = "p.title ASC";
    if (sort === "name-desc") orderBy = "p.title DESC";

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.price,
        p.material,
        p.color,
        p.dimensions,
        p.short_description,
        p.description,
        p.image_url,
        p.in_stock,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ORDER BY ${orderBy};
    `;

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    res.status(500).json({ message: "Не удалось получить список товаров." });
  }
});

router.get("/categories/all", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, slug FROM categories ORDER BY name ASC;"
    );
    res.json(rows);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    res.status(500).json({ message: "Не удалось получить список категорий." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.price,
        p.material,
        p.color,
        p.dimensions,
        p.short_description,
        p.description,
        p.image_url,
        p.in_stock,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Товар не найден." });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return res.status(500).json({ message: "Не удалось получить информацию о товаре." });
  }
});

module.exports = router;
