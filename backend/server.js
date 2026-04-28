const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

/* ─────────────────────────────
   STATIC IMAGES (IMPORTANT)
───────────────────────────── */
app.use('/pics', express.static(path.join(__dirname, 'pics')));

/* ─────────────────────────────
   PRODUCTS DATA
   (IMPORTANT: use RELATIVE PATH)
───────────────────────────── */
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    desc: 'High quality wireless sound.',
    price: 1999,
    tag: 'HOT',
    category: 'Gadgets',
    stars: 4.5,
    img: '/pics/headphones.jpg'
  },
  {
    id: 2,
    name: 'Smart Watch',
    desc: 'Track fitness and notifications.',
    price: 2599,
    tag: 'HOT',
    category: 'Gadgets',
    stars: 4.6,
    img: '/pics/watch.jpg'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    desc: 'Compact speaker with rich bass.',
    price: 899,
    tag: 'NEW',
    category: 'Gadgets',
    stars: 4.3,
    img: '/pics/speaker.jpg'
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    desc: 'True wireless earbuds with charging case.',
    price: 1299,
    tag: 'SALE',
    category: 'Gadgets',
    stars: 4.1,
    img: '/pics/earbuds.jpg'
  },
  {
    id: 5,
    name: 'Portable Charger',
    desc: '10,000mAh power bank for travel.',
    price: 699,
    tag: null,
    category: 'Gadgets',
    stars: 4.0,
    img: '/pics/powerbank.jpg'
  }
];

/* ─────────────────────────────
   CART + ORDERS
───────────────────────────── */
let cart = [];
let orders = [];

/* ─────────────────────────────
   ROUTES
───────────────────────────── */

// API test
app.get('/', (req, res) => {
  res.send('ShopSmart API Running 🚀');
});

// GET PRODUCTS
app.get('/products', (req, res) => {
  res.json(products);
});

// GET CART
app.get('/cart', (req, res) => {
  res.json(cart);
});

// ADD TO CART
app.post('/cart', (req, res) => {
  const { id, name, price, img } = req.body;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
    return res.json({ message: 'Updated', cart });
  }

  cart.push({ id, name, price, img, quantity: 1 });

  res.json({ message: 'Added', cart });
});

// REMOVE ITEM
app.post('/cart/remove', (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id !== id);

  res.json({ message: 'Removed', cart });
});

// UPDATE QUANTITY
app.post('/cart/update', (req, res) => {
  const { id, quantity } = req.body;

  const item = cart.find(i => i.id === id);

  if (item) {
    item.quantity = quantity;
    return res.json({ message: 'Updated', cart });
  }

  res.status(404).json({ message: 'Item not found' });
});

// PLACE ORDER
app.post('/order', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order' });
  }

  const order = {
    id: Date.now(),
    customer,
    items,
    total,
    createdAt: new Date()
  };

  orders.push(order);
  cart = [];

  res.json({ message: 'Order placed', order });
});

// CLEAR CART
app.delete('/cart', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

/* ─────────────────────────────
   START SERVER (RAILWAY READY)
───────────────────────────── */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});