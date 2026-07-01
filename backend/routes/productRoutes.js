import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Sample seed products (5 items)
const seedProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    description: 'Experience premium sound quality with active noise cancellation, comfortable over-ear design, and up to 30 hours of battery life. Perfect for travel, work, and gaming.',
    category: 'Electronics',
    price: 199.99,
    countInStock: 10,
  },
  {
    name: 'Minimalist Smart Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
    description: 'A stylish smartwatch tracking steps, heart rate, sleep quality, and active notifications. Features a vibrant AMOLED display and 7-day battery life.',
    category: 'Wearables',
    price: 129.50,
    countInStock: 7,
  },
  {
    name: 'Ultra-HD DSLR Camera',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=60',
    description: 'Capture stunning details with this high-resolution DSLR camera featuring a 24.2 MP sensor, dual pixel autofocus, and 4K video recording. Includes an 18-55mm lens kit.',
    category: 'Electronics',
    price: 649.00,
    countInStock: 5,
  },
  {
    name: 'Sleek 14-Inch Ultrabook Laptop',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e3f?w=800&auto=format&fit=crop&q=60',
    description: 'Ultra-thin, lightweight, and powerful. Packing an Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for developers, creators, and productivity professionals.',
    category: 'Computers',
    price: 999.00,
    countInStock: 4,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60',
    description: 'Enhance your gaming performance with hot-swappable linear mechanical switches, custom RGB backlighting, and a compact 75% form factor.',
    category: 'Accessories',
    price: 89.99,
    countInStock: 15,
  },
];

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.id || req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid product ID format or server error' });
  }
});

// @desc    Seed database with sample products
// @route   POST /api/products/seed
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    // Delete existing products to avoid duplicates when seeding
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(seedProducts);
    res.status(201).json({ message: 'Sample products seeded successfully', products: createdProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
