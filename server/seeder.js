const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

// Connect to DB will happen inside the functions

const users = [
  {
    name: 'Admin User',
    email: 'admin@quickcart.com',
    password: 'password123',
    phone: '9999999999',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '8888888888',
    role: 'customer',
  },
];

const categories = [
  {
    name: 'Fruits & Vegetables',
    description: 'Fresh produce sourced directly from farms.',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&q=80',
    isActive: true,
  },
  {
    name: 'Dairy & Bakery',
    description: 'Milk, cheese, bread, and more.',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80',
    isActive: true,
  },
  {
    name: 'Snacks & Beverages',
    description: 'Chips, cold drinks, juices, and snacks.',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&q=80',
    isActive: true,
  },
  {
    name: 'Personal Care',
    description: 'Soaps, shampoos, and personal hygiene products.',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    isActive: true,
  },
];

const products = [
  // Fruits & Vegetables
  {
    name: 'Fresh Red Apples',
    description: 'Crisp and sweet red apples directly from the orchards.',
    price: 150,
    discountPrice: 120,
    stock: 50,
    unit: '1 kg',
    quantity: '1 kg',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries, perfect for desserts.',
    price: 200,
    discountPrice: 180,
    stock: 40,
    unit: '1 Box',
    quantity: '250g',
    brand: 'BerryFarms',
    image: 'https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Green Bell Peppers',
    description: 'Crunchy and fresh green capsicums.',
    price: 60,
    stock: 45,
    unit: '500 g',
    quantity: '500g',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Fresh Potatoes',
    description: 'Premium quality unwashed farm potatoes.',
    price: 40,
    stock: 120,
    unit: '1 kg',
    quantity: '1 kg',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Farm Fresh Cucumber',
    description: 'Crisp, cooling cucumbers freshly harvested.',
    price: 45,
    discountPrice: 35,
    stock: 35,
    unit: '500 g',
    quantity: '500g',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Fresh Red Onions',
    description: 'Pungent, high-grade red onions essential for daily cooking.',
    price: 55,
    discountPrice: 42,
    stock: 80,
    unit: '1 kg',
    quantity: '1 kg',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Fresh Organic Kiwi',
    description: 'Nutritious green kiwis packed with Vitamin C and dietary fiber.',
    price: 130,
    discountPrice: 110,
    stock: 25,
    unit: 'Pack of 3',
    quantity: '3 pcs',
    brand: 'Zespri',
    image: 'https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Juicy Yellow Lemons',
    description: 'Tangy and aromatic fresh yellow lemons.',
    price: 40,
    discountPrice: 28,
    stock: 60,
    unit: 'Pack of 4',
    quantity: '4 pcs',
    brand: 'CitrusFarm',
    image: 'https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Green Chili Peppers',
    description: 'Spicy and vibrant green chilies to add heat to your recipes.',
    price: 30,
    discountPrice: 22,
    stock: 50,
    unit: '250 g',
    quantity: '250g',
    brand: 'FarmFresh',
    image: 'https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  {
    name: 'Wild Sweet Mulberries',
    description: 'Handpicked wild mulberries rich in antioxidants.',
    price: 160,
    discountPrice: 135,
    stock: 15,
    unit: '1 Box',
    quantity: '200g',
    brand: 'BerryFarms',
    image: 'https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp',
    categoryName: 'Fruits & Vegetables',
    isActive: true,
  },
  // Dairy & Bakery
  {
    name: 'Farm Fresh Milk',
    description: 'Pasteurized full cream milk, rich in calcium.',
    price: 66,
    stock: 40,
    unit: '1 L',
    quantity: '1L',
    brand: 'Amul',
    image: 'https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp',
    categoryName: 'Dairy & Bakery',
    isActive: true,
  },
  {
    name: 'Farm Eggs (Pack of 12)',
    description: 'Fresh, protein-rich white eggs.',
    price: 90,
    stock: 60,
    unit: '12 pieces',
    quantity: '12 pcs',
    brand: 'Eggcellent',
    image: 'https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp',
    categoryName: 'Dairy & Bakery',
    isActive: true,
  },
  {
    name: 'Vanilla Bean Ice Cream',
    description: 'Creamy real vanilla bean ice cream tub made with fresh dairy.',
    price: 199,
    discountPrice: 169,
    stock: 20,
    unit: '500 ml',
    quantity: '500ml',
    brand: 'Amul',
    image: 'https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp',
    categoryName: 'Dairy & Bakery',
    isActive: true,
  },
  {
    name: 'Pure Organic Honey Jar',
    description: '100% natural raw forest honey, rich in natural enzymes.',
    price: 260,
    discountPrice: 220,
    stock: 30,
    unit: '500 g',
    quantity: '500g',
    brand: 'Dabur',
    image: 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp',
    categoryName: 'Dairy & Bakery',
    isActive: true,
  },
  // Snacks & Beverages
  {
    name: 'Orange Juice 100%',
    description: 'No added sugar orange juice. Packed with Vitamin C.',
    price: 110,
    discountPrice: 99,
    stock: 30,
    unit: '1 L',
    quantity: '1L',
    brand: 'Tropicana',
    image: 'https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Cola Soft Drink',
    description: 'Refreshing carbonated cola drink.',
    price: 40,
    stock: 120,
    unit: '750 ml',
    quantity: '750ml',
    brand: 'Coca-Cola',
    image: 'https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Spring Water',
    description: 'Pure natural spring water.',
    price: 20,
    stock: 300,
    unit: '1 L',
    quantity: '1L',
    brand: 'Aquafina',
    image: 'https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Nescafe Classic Instant Coffee',
    description: 'Rich and aromatic premium roasted coffee granules.',
    price: 180,
    discountPrice: 155,
    stock: 45,
    unit: '100 g',
    quantity: '100g',
    brand: 'Nescafe',
    image: 'https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Refined Cooking Sunflower Oil',
    description: 'Light and healthy sunflower oil enriched with Vitamins A & D.',
    price: 165,
    discountPrice: 145,
    stock: 50,
    unit: '1 L',
    quantity: '1L',
    brand: 'Fortune',
    image: 'https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Royal Basmati Rice',
    description: 'Aromatic long-grain basmati rice aged to perfection.',
    price: 150,
    discountPrice: 129,
    stock: 75,
    unit: '1 kg',
    quantity: '1 kg',
    brand: 'India Gate',
    image: 'https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  {
    name: 'Whey Protein Powder Chocolate',
    description: 'High quality whey isolate protein powder for post-workout recovery.',
    price: 1699,
    discountPrice: 1399,
    stock: 12,
    unit: '1 kg',
    quantity: '1kg',
    brand: 'Optimum Nutrition',
    image: 'https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp',
    categoryName: 'Snacks & Beverages',
    isActive: true,
  },
  // Personal Care
  {
    name: 'Olay Body Wash',
    description: 'Ultra moisture shea butter body wash for smooth skin.',
    price: 299,
    discountPrice: 250,
    stock: 25,
    unit: '250 ml',
    quantity: '250ml',
    brand: 'Olay',
    image: 'https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  },
  {
    name: 'Vaseline Men Face Lotion',
    description: 'Fast absorbing body and face lotion for men.',
    price: 199,
    discountPrice: 175,
    stock: 40,
    unit: '200 ml',
    quantity: '200ml',
    brand: 'Vaseline',
    image: 'https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  },
  {
    name: 'Attitude Hand Soap',
    description: 'Super leaves natural hand soap.',
    price: 149,
    stock: 50,
    unit: '473 ml',
    quantity: '473ml',
    brand: 'Attitude',
    image: 'https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  },
  {
    name: 'Soft Facial Tissue Paper Box',
    description: 'Ultra-soft 2-ply facial tissue paper box for everyday freshness.',
    price: 95,
    discountPrice: 79,
    stock: 65,
    unit: '1 Box',
    quantity: '100 pulls',
    brand: 'Paseo',
    image: 'https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  },
  {
    name: 'Essence Mascara Lash Princess',
    description: 'Dramatic volume false lash effect mascara.',
    price: 349,
    discountPrice: 299,
    stock: 20,
    unit: '1 piece',
    quantity: '1 pc',
    brand: 'Essence',
    image: 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  },
  {
    name: 'Classic Velvet Red Lipstick',
    description: 'Long-lasting hydrating matte red lipstick with intense color payoff.',
    price: 299,
    discountPrice: 249,
    stock: 28,
    unit: '1 piece',
    quantity: '1 pc',
    brand: 'Maybelline',
    image: 'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
    categoryName: 'Personal Care',
    isActive: true,
  }
];

const coupons = [
  {
    code: 'WELCOME50',
    discountType: 'percentage',
    discountValue: 50,
    minimumOrder: 200,
    maximumDiscount: 100,
    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minimumOrder: 500,
    expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  }
];

const importData = async (force = false) => {
  try {
    // Connect to DB first if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected');
    }

    if (!force) {
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('Database already populated. Preserving existing users, credentials, and data.');
        return;
      }
    }

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    // Hash passwords for users
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    }));

    // Insert users
    await User.insertMany(usersWithHashedPasswords);

    // Insert categories
    const createdCategories = await Category.insertMany(categories);

    // Map category names to IDs for products
    const productsWithCategoryIds = products.map(product => {
      const category = createdCategories.find(c => c.name === product.categoryName);
      return {
        ...product,
        category: category._id
      };
    });

    // Insert products
    await Product.insertMany(productsWithCategoryIds);

    // Insert coupons
    await Coupon.insertMany(coupons);

    console.log('Data Imported successfully!');
    if (require.main === module) process.exit();
  } catch (error) {
    console.error(`${error}`);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

const destroyData = async () => {
  try {
    // Connect to DB first
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();

    console.log('Data Destroyed successfully!');
    if (require.main === module) process.exit();
  } catch (error) {
    console.error(`${error}`);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }
}

module.exports = { runSeeder: importData };

