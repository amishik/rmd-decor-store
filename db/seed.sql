INSERT INTO users (full_name, email, phone, city, street_address)
VALUES
('Эмма Картер', 'emma.carter@example.com', '+7 900 123-45-67', 'Москва', 'ул. Садовая, 18, кв. 24');

INSERT INTO categories (name, slug)
VALUES
('Свечи', 'candles'),
('Вазы', 'vases'),
('Настенный декор', 'wall-decor'),
('Текстиль', 'textiles'),
('Хранение', 'storage'),
('Настольный декор', 'table-decor');

INSERT INTO products (
  category_id, title, slug, price, material, color, dimensions,
  short_description, description, image_url, in_stock
)
VALUES
(
  1,
  'Ароматическая свеча Sandstone',
  'sandstone-scented-candle',
  2490.00,
  'Соевый воск, керамика',
  'Теплый бежевый',
  '8 x 8 x 10 см',
  'Теплая свеча с мягким ароматом ванили и кедра.',
  'Уютная интерьерная свеча в матовом керамическом стакане. Подходит для спальни, гостиной и спокойных вечерних ритуалов.',
  '/images/candle.svg',
  TRUE
),
(
  2,
  'Ваза Ivory Ripple',
  'ivory-ripple-vase',
  3950.00,
  'Глазурованная керамика',
  'Слоновая кость',
  '16 x 16 x 24 см',
  'Фактурная ваза для сухоцветов и веток.',
  'Скульптурная керамическая ваза с мягким рельефом. Хорошо смотрится на консоли, комоде или обеденном столе.',
  '/images/vase.svg',
  TRUE
),
(
  3,
  'Зеркало Arc Brass',
  'arc-brass-mirror',
  11900.00,
  'Стекло, металл',
  'Мягкое золото',
  '50 x 70 см',
  'Настенное зеркало с тонкой рамой.',
  'Лаконичное зеркало со скругленными углами, которое делает интерьер светлее и визуально просторнее.',
  '/images/mirror.svg',
  TRUE
),
(
  4,
  'Декоративная подушка Linen',
  'linen-decorative-pillow',
  3200.00,
  'Лен, полиэфирный наполнитель',
  'Овсяный',
  '45 x 45 см',
  'Мягкая подушка с деликатной фактурой.',
  'Нейтральная декоративная подушка для дивана или кровати. Легко сочетается с пледами и керамикой.',
  '/images/pillow.svg',
  TRUE
),
(
  5,
  'Плетеная корзина Woven',
  'woven-storage-basket',
  4600.00,
  'Морская трава, хлопок',
  'Натуральный песочный',
  '35 x 35 x 32 см',
  'Корзина для пледов, журналов и хранения.',
  'Практичная корзина ручного плетения, которая помогает поддерживать порядок и остается частью декора.',
  '/images/basket.svg',
  TRUE
),
(
  6,
  'Скульптура Travertine',
  'travertine-table-sculpture',
  5800.00,
  'Каменный композит',
  'Кремовый камень',
  '20 x 8 x 24 см',
  'Декоративный объект для полки или столика.',
  'Спокойный скульптурный акцент для журнального столика, комода или стеллажа в нейтральном интерьере.',
  '/images/sculpture.svg',
  TRUE
);

INSERT INTO carts (user_id)
VALUES (1);

INSERT INTO orders (
  user_id, full_name, email, phone, city, street_address, notes, total_amount, status, created_at
)
VALUES
(
  1,
  'Эмма Картер',
  'emma.carter@example.com',
  '+7 900 123-45-67',
  'Москва',
  'ул. Садовая, 18, кв. 24',
  'Позвоните за 15 минут до доставки.',
  5690.00,
  'Доставлен',
  CURRENT_TIMESTAMP - INTERVAL '10 days'
);

INSERT INTO order_items (order_id, product_id, product_title, quantity, unit_price)
VALUES
(1, 1, 'Ароматическая свеча Sandstone', 1, 2490.00),
(1, 4, 'Декоративная подушка Linen', 1, 3200.00);
