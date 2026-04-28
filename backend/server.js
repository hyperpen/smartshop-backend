const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ── Serve images ──
app.use('/pics', express.static(path.join(__dirname, 'pics')));

// ── PRODUCTS ──
const products = [
  // Gadgets (5)
  { id:1, name:'Wireless Headphones', desc:'High quality wireless sound.', price:1999, tag:'HOT', category:'Gadgets', stars:4.5, img:'http://192.168.1.11:3000/pics/headphones.jpg' },
  { id:2, name:'Smart Watch', desc:'Track fitness and notifications.', price:2599, tag:'HOT', category:'Gadgets', stars:4.6, img:'http://192.168.1.11:3000/pics/watch.jpg' },
  { id:3, name:'Bluetooth Speaker', desc:'Compact speaker with rich bass.', price:899, tag:'NEW', category:'Gadgets', stars:4.3, img:'http://192.168.1.11:3000/pics/speaker.jpg' },
  { id:4, name:'Wireless Earbuds', desc:'True wireless earbuds with charging case.', price:1299, tag:'SALE', category:'Gadgets', stars:4.1, img:'http://192.168.1.11:3000/pics/earbuds.jpg' },
  { id:5, name:'Portable Charger', desc:'10,000mAh power bank for travel.', price:699, tag:null, category:'Gadgets', stars:4.0, img:'http://192.168.1.11:3000/pics/powerbank.jpg' },

  // Fashion (5)
  { id:6, name:'Casual Sneakers', desc:'Comfortable everyday shoes.', price:1499, tag:'SALE', category:'Fashion', stars:4.2, img:'http://192.168.1.11:3000/pics/sneakers.jpg' },
  { id:7, name:'Denim Jacket', desc:'Classic denim jacket for all seasons.', price:2199, tag:null, category:'Fashion', stars:4.4, img:'http://192.168.1.11:3000/pics/denim.jpg' },
  { id:8, name:'Hoodie', desc:'Soft fleece hoodie with kangaroo pocket.', price:999, tag:'HOT', category:'Fashion', stars:4.0, img:'http://192.168.1.11:3000/pics/hoodie.jpg' },
  { id:9, name:'Sunglasses', desc:'UV-protection fashionable shades.', price:599, tag:null, category:'Fashion', stars:4.1, img:'http://192.168.1.11:3000/pics/sunglasses.jpg' },
  { id:10, name:'Leather Belt', desc:'Premium leather belt, adjustable fit.', price:499, tag:null, category:'Fashion', stars:4.2, img:'http://192.168.1.11:3000/pics/belt.jpg' },

  // School (5)
  { id:11, name:'Backpack', desc:'Durable backpack with laptop sleeve.', price:1299, tag:'SALE', category:'School', stars:4.3, img:'http://192.168.1.11:3000/pics/backpack.jpg' },
  { id:12, name:'Notebook Set', desc:'Set of 3 ruled notebooks.', price:249, tag:null, category:'School', stars:4.0, img:'http://192.168.1.11:3000/pics/notebooks.jpg' },
  { id:13, name:'Pen Set', desc:'Smooth-writing gel pen set.', price:149, tag:null, category:'School', stars:4.1, img:'http://192.168.1.11:3000/pics/pens.jpg' },
  { id:14, name:'USB Flash Drive', desc:'64GB USB 3.0 flash drive.', price:399, tag:'HOT', category:'School', stars:4.2, img:'http://192.168.1.11:3000/pics/flashdrive.jpg' },
  { id:15, name:'Scientific Calculator', desc:'Graphing calculator for students.', price:1799, tag:null, category:'School', stars:4.4, img:'http://192.168.1.11:3000/pics/calculator.jpg' },

  // Home (5)
  { id:16, name:'LED Desk Lamp', desc:'Adjustable lamp with warm/cool modes.', price:899, tag:null, category:'Home', stars:4.3, img:'http://192.168.1.11:3000/pics/desklamp.jpg' },
  { id:17, name:'Ceramic Mug', desc:'Modern minimalist coffee mug.', price:249, tag:null, category:'Home', stars:4.0, img:'http://192.168.1.11:3000/pics/mug.jpg' },
  { id:18, name:'Throw Pillow', desc:'Soft decorative pillow 45x45cm.', price:599, tag:'SALE', category:'Home', stars:4.1, img:'http://192.168.1.11:3000/pics/pillow.jpg' },
  { id:19, name:'Scented Candle', desc:'Soy wax candle, calming scents.', price:349, tag:null, category:'Home', stars:4.2, img:'http://192.168.1.11:3000/pics/candle.jpg' },
  { id:20, name:'Kitchen Knife Set', desc:'3-piece stainless steel knife set.', price:1299, tag:'HOT', category:'Home', stars:4.5, img:'http://192.168.1.11:3000/pics/knives.jpg' },

  // Lifestyle (5)
  { id:21, name:'Yoga Mat', desc:'Non-slip yoga mat, 6mm thickness.', price:799, tag:null, category:'Lifestyle', stars:4.2, img:'http://192.168.1.11:3000/pics/yogamat.jpg' },
  { id:22, name:'Insulated Water Bottle', desc:'Keeps drinks cold for 24 hours.', price:599, tag:'NEW', category:'Lifestyle', stars:4.4, img:'http://192.168.1.11:3000/pics/waterbottle.jpg' },
  { id:23, name:'Reusable Straw Kit', desc:'Stainless steel straw with brush.', price:199, tag:null, category:'Lifestyle', stars:4.0, img:'http://192.168.1.11:3000/pics/straws.jpg' },
  { id:24, name:'Planner 2026', desc:'Daily planner with habit tracker.', price:399, tag:null, category:'Lifestyle', stars:4.1, img:'http://192.168.1.11:3000/pics/planner.jpg' },
  { id:25, name:'Fitness Band', desc:'Lightweight band for daily activity.', price:1099, tag:'HOT', category:'Lifestyle', stars:4.0, img:'http://192.168.1.11:3000/pics/fitnessband.jpg' }
];

let cart = [];
let orders = [];

// ── ROUTES ──
app.get('/', (req, res) => {
  res.send('ShopSmart API Running 🚀');
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', (req, res) => {
  res.json(cart);
});

app.post('/cart', (req, res) => {
  const { id, name, price, img } = req.body;

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity += 1;
    return res.json({ message: 'Updated', cart });
  }

  cart.push({ id, name, price, img, quantity: 1 });
  res.json({ message: 'Added', cart });
});

// Remove item from cart
app.post('/cart/remove', (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id !== id);
  res.json({ message: 'Removed', cart });
});

// Update cart item quantity
app.post('/cart/update', (req, res) => {
  const { id, quantity } = req.body;
  const item = cart.find(i => i.id === id);

  if (item) {
    item.quantity = quantity;
    return res.json({ message: 'Updated', cart });
  }

  res.status(404).json({ message: 'Item not found' });
});

// ── PLACE ORDER ──
app.post('/order', (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid order payload' });
  }

  const orderId = Date.now();
  const order = { id: orderId, customer, items, total, createdAt: new Date() };
  orders.push(order);

  // Clear cart now that order is placed
  cart = [];

  res.json({ message: 'Order placed', orderId, order });
});

// 🟢 CLEAR CART (ORDER COMPLETE)
app.delete('/cart', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

// ── START SERVER ──
app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log('API running...');
});