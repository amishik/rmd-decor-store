UPDATE users
SET
  full_name = 'Эмма Картер',
  city = 'Москва',
  street_address = 'ул. Садовая, 18, кв. 24'
WHERE id = 1;

UPDATE categories SET name = 'Свечи' WHERE slug = 'candles';
UPDATE categories SET name = 'Вазы' WHERE slug = 'vases';
UPDATE categories SET name = 'Настенный декор' WHERE slug = 'wall-decor';
UPDATE categories SET name = 'Текстиль' WHERE slug = 'textiles';
UPDATE categories SET name = 'Хранение' WHERE slug = 'storage';
UPDATE categories SET name = 'Настольный декор' WHERE slug = 'table-decor';

UPDATE products
SET
  title = 'Ароматическая свеча Sandstone',
  price = 2490.00,
  material = 'Соевый воск, керамика',
  color = 'Теплый бежевый',
  dimensions = '8 x 8 x 10 см',
  short_description = 'Теплая свеча с мягким ароматом ванили и кедра.',
  description = 'Уютная интерьерная свеча в матовом керамическом стакане. Подходит для спальни, гостиной и спокойных вечерних ритуалов.',
  image_url = '/images/candle.svg'
WHERE slug = 'sandstone-scented-candle';

UPDATE products
SET
  title = 'Ваза Ivory Ripple',
  price = 3950.00,
  material = 'Глазурованная керамика',
  color = 'Слоновая кость',
  dimensions = '16 x 16 x 24 см',
  short_description = 'Фактурная ваза для сухоцветов и веток.',
  description = 'Скульптурная керамическая ваза с мягким рельефом. Хорошо смотрится на консоли, комоде или обеденном столе.',
  image_url = '/images/vase.svg'
WHERE slug = 'ivory-ripple-vase';

UPDATE products
SET
  title = 'Зеркало Arc Brass',
  price = 11900.00,
  material = 'Стекло, металл',
  color = 'Мягкое золото',
  dimensions = '50 x 70 см',
  short_description = 'Настенное зеркало с тонкой рамой.',
  description = 'Лаконичное зеркало со скругленными углами, которое делает интерьер светлее и визуально просторнее.',
  image_url = '/images/mirror.svg'
WHERE slug = 'arc-brass-mirror';

UPDATE products
SET
  title = 'Декоративная подушка Linen',
  price = 3200.00,
  material = 'Лен, полиэфирный наполнитель',
  color = 'Овсяный',
  dimensions = '45 x 45 см',
  short_description = 'Мягкая подушка с деликатной фактурой.',
  description = 'Нейтральная декоративная подушка для дивана или кровати. Легко сочетается с пледами и керамикой.',
  image_url = '/images/pillow.svg'
WHERE slug = 'linen-decorative-pillow';

UPDATE products
SET
  title = 'Плетеная корзина Woven',
  price = 4600.00,
  material = 'Морская трава, хлопок',
  color = 'Натуральный песочный',
  dimensions = '35 x 35 x 32 см',
  short_description = 'Корзина для пледов, журналов и хранения.',
  description = 'Практичная корзина ручного плетения, которая помогает поддерживать порядок и остается частью декора.',
  image_url = '/images/basket.svg'
WHERE slug = 'woven-storage-basket';

UPDATE products
SET
  title = 'Скульптура Travertine',
  price = 5800.00,
  material = 'Каменный композит',
  color = 'Кремовый камень',
  dimensions = '20 x 8 x 24 см',
  short_description = 'Декоративный объект для полки или столика.',
  description = 'Спокойный скульптурный акцент для журнального столика, комода или стеллажа в нейтральном интерьере.',
  image_url = '/images/sculpture.svg'
WHERE slug = 'travertine-table-sculpture';

UPDATE orders
SET
  full_name = 'Эмма Картер',
  city = 'Москва',
  street_address = 'ул. Садовая, 18, кв. 24',
  notes = 'Позвоните за 15 минут до доставки.',
  total_amount = 5690.00,
  status = 'Доставлен'
WHERE id = 1;

UPDATE order_items
SET product_title = 'Ароматическая свеча Sandstone', unit_price = 2490.00
WHERE order_id = 1 AND product_id = 1;

UPDATE order_items
SET product_title = 'Декоративная подушка Linen', unit_price = 3200.00
WHERE order_id = 1 AND product_id = 4;
