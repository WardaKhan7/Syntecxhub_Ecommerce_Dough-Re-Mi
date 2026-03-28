const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const productsData = [
  // Cakes
  { name: 'Belgian Chocolate Truffle', category: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { name: 'Red Velvet Royale', category: 'Cakes', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80' },
  { name: 'Strawberry Shortcake Dream', category: 'Cakes', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Blueberry Bliss Cheesecake', category: 'Cakes', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80' },
  { name: 'Pistachio & Rose Elegance', category: 'Cakes', image: 'https://images.unsplash.com/photo-1519340333755-50721343e29e?w=800&q=80' },
  { name: 'Caramel Crunch Delight', category: 'Cakes', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80' },
  { name: 'Classic Vanilla Bean', category: 'Cakes', image: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?w=800&q=80' },
  { name: 'Hazelnut Praline Feast', category: 'Cakes', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },
  { name: 'Lemon Zest Sunshine', category: 'Cakes', image: 'https://images.unsplash.com/photo-1519340333755-50721343e29e?w=800&q=80' },
  { name: 'Coffee Mocha Magic', category: 'Cakes', image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800&q=80' },
  { name: 'Mango Alphonso Special', category: 'Cakes', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Black Forest Classic', category: 'Cakes', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Pineapple Paradise', category: 'Cakes', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Dark Forest Gateau', category: 'Cakes', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },
  { name: 'White Chocolate Raspberry', category: 'Cakes', image: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?w=800&q=80' },

  // Theme Cakes
  { name: 'Frozen Elsa Theme Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80' },
  { name: 'Spider-Man Heroic City Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800&q=80' },
  { name: 'Unicorn Rainbow Magic Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&q=80' },
  { name: 'Space Explorer Adventure Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80' },
  { name: 'Jungle Safari Animals Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&q=80' },
  { name: 'Little Mermaid Under the Sea Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80' },
  { name: 'Disney Princess Castle Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800&q=80' },
  { name: 'Mickey Mouse Clubhouse Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&q=80' },
  { name: 'Batman Gotham Night Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80' },
  { name: 'Peppa Pig Playful Park Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&q=80' },
  { name: 'Harry Potter Wizardry Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&q=80' },
  { name: 'Star Wars Galactic War Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c2?w=800&q=80' },
  { name: 'Avengers Assemble Force Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&q=80' },
  { name: 'Minecraft Blocky World Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80' },
  { name: 'Barbie Glamour Pink Cake', category: 'Theme Cakes', image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&q=80' },

  // Desserts
  { name: 'Chocolate Lava Explosion', category: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80' },
  { name: 'New York Baked Cheesecake', category: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80' },
  { name: 'Assorted Macaron Box', category: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80' },
  { name: 'Tiramisu Coffee Treat', category: 'Desserts', image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80' },
  { name: 'Creme Brulee Classic', category: 'Desserts', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80' },
  { name: 'Warm Apple Pie Slice', category: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80' },
  { name: 'Banoffee Pie Pot', category: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80' },
  { name: 'Chocolate Fudge Brownie', category: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80' },
  { name: 'Vanilla Panacotta Cup', category: 'Desserts', image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80' },
  { name: 'Fruit Tart Medley', category: 'Desserts', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80' },
  { name: 'Red Velvet Jar Cake', category: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80' },
  { name: 'Chocolate Mousse Mousse', category: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80' },
  { name: 'Salted Caramel Tart', category: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80' },
  { name: 'Lemon Meringue Mini', category: 'Desserts', image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=800&q=80' },
  { name: 'Baklava Pistachio Square', category: 'Desserts', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&q=80' },

  // Birthday
  { name: 'Confetti Celebration Cake', category: 'Birthday', image: 'https://images.unsplash.com/photo-1519340333755-50721343e29e?w=800&q=80' },
  { name: 'Birthday Balloon Extravaganza', category: 'Birthday', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { name: 'Happy Birthday Sprinkles', category: 'Birthday', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Number One First Birthday', category: 'Birthday', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Birthday Blast Chocolate', category: 'Birthday', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80' },
  { name: 'Golden Jubilee Celebration', category: 'Birthday', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80' },
  { name: 'Birthday Wish Vanilla', category: 'Birthday', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Colorful Pinata Cake', category: 'Birthday', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },
  { name: 'Super Hero Birthday Mix', category: 'Birthday', image: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?w=800&q=80' },
  { name: 'Birthday Sparkle Rose', category: 'Birthday', image: 'https://images.unsplash.com/photo-1519340333755-50721343e29e?w=800&q=80' },
  { name: 'Chocolate Overload Birthday', category: 'Birthday', image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800&q=80' },
  { name: 'Classic Birthday Buttercream', category: 'Birthday', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Birthday Party Platter', category: 'Birthday', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Custom Name Birthday Cake', category: 'Birthday', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Birthday Joy Fruit Cake', category: 'Birthday', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },

  // Hampers
  { name: 'Luxury Dessert Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1544473244-f6895a69ad0b?w=800&q=80' },
  { name: 'Celebration Gift Basket', category: 'Hampers', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
  { name: 'Sweet Surprises Bundle', category: 'Hampers', image: 'https://images.unsplash.com/photo-1549462980-6a620041849c?w=800&q=80' },
  { name: 'Gourmet Cookie Collection', category: 'Hampers', image: 'https://images.unsplash.com/photo-1544473244-f6895a69ad0b?w=800&q=80' },
  { name: 'Family Treats Box', category: 'Hampers', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
  { name: 'Executive Corporate Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1549462980-6a620041849c?w=800&q=80' },
  { name: 'Breakfast Delights Basket', category: 'Hampers', image: 'https://images.unsplash.com/photo-1544473244-f6895a69ad0b?w=800&q=80' },
  { name: 'Tea Time Snack Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
  { name: 'Festive Season Special', category: 'Hampers', image: 'https://images.unsplash.com/photo-1549462980-6a620041849c?w=800&q=80' },
  { name: 'Health Conscious Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1544473244-f6895a69ad0b?w=800&q=80' },
  { name: 'Kids Joy Party Box', category: 'Hampers', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
  { name: 'Midnight Cravings Kit', category: 'Hampers', image: 'https://images.unsplash.com/photo-1549462980-6a620041849c?w=800&q=80' },
  { name: 'Artisan Bread Basket', category: 'Hampers', image: 'https://images.unsplash.com/photo-1544473244-f6895a69ad0b?w=800&q=80' },
  { name: 'Chocolate Lovers Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80' },
  { name: 'Grand Celebration Hamper', category: 'Hampers', image: 'https://images.unsplash.com/photo-1549462980-6a620041849c?w=800&q=80' },

  // Anniversary
  { name: 'Forever Love Heart Cake', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1586985289906-4069f07fe437?w=800&q=80' },
  { name: 'Golden Anniversary Tiered', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { name: 'Silver Jubilee Special', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Elegant Rose Anniversary', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Together Forever Red Velvet', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&q=80' },
  { name: 'Romantic Candlelight Cake', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80' },
  { name: 'Milestone Anniversary Cake', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'Classic Pearl Anniversary', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },
  { name: 'Anniversary Bliss Chocolate', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1557925923-33b27f891f88?w=800&q=80' },
  { name: 'Soulmate Celebration Cake', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1519340333755-50721343e29e?w=800&q=80' },
  { name: 'Anniversary Sparkle Gold', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800&q=80' },
  { name: 'Love Birds Anniversary', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&q=80' },
  { name: 'Eternal Bond Vanilla', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Anniversary Flower Bouquet', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80' },
  { name: 'True Love Cheesecake', category: 'Anniversary', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },

  // Occasions
  { name: 'Halloween Spooky Night Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=800&q=80' },
  { name: 'Eid Mubarak Royal Delight', category: 'Occasions', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80' },
  { name: 'Christmas Festive Yule Log', category: 'Occasions', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' },
  { name: 'New Year Grand Countdown Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=800&q=80' },
  { name: 'Valentines Sweetheart Red Velvet', category: 'Occasions', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80' },
  { name: 'Mothers Day Floral Love Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' },
  { name: 'Fathers Day Super Hero Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=800&q=80' },
  { name: 'Graduation Day Success Cap', category: 'Occasions', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80' },
  { name: 'Baby Shower Welcome Joy', category: 'Occasions', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' },
  { name: 'Housewarming Sweet Home Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=800&q=80' },
  { name: 'Diwali Festive Sparkle Platter', category: 'Occasions', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80' },
  { name: 'Rakhi Special Bond Delight', category: 'Occasions', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' },
  { name: 'Wedding Engagement Diamond Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=800&q=80' },
  { name: 'Teacher Appreciation Thank You', category: 'Occasions', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&q=80' },
  { name: 'Independence Day Pride Cake', category: 'Occasions', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' }
];

const products = productsData.map((p, idx) => ({
  name: p.name,
  description: `A premium ${p.category.toLowerCase()} masterpiece. Handcrafted with the finest ingredients for your special moments.`,
  price: 800 + (Math.floor(Math.random() * 30) * 100),
  category: p.category,
  imageUrl: p.image,
  stock: 15 + Math.floor(Math.random() * 25),
  rating: 0,
  numReviews: 0,
  reviews: [], // Initialize as empty array
  isBestSeller: idx % 10 === 0 // Mark some as best sellers
}));

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected for seeding');

    console.log('Clearing existing products...');
    await Product.deleteMany(); 
    
    console.log(`Inserting ${products.length} new products...`);
    await Product.insertMany(products);
    console.log('Database seeded successfully with creative product names!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
