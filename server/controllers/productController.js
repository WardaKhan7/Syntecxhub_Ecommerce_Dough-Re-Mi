const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const category = req.query.category;
    const isBestSeller = req.query.isBestSeller;

    const query = {};

    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: 'i',
      };
    }

    if (category) {
      query.category = category;
    }

    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, stock, isBestSeller } = req.body;

    const product = new Product({
      name: name || 'New Dessert',
      price: price !== undefined && price !== '' ? Number(price) : 0,
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      category: category || 'Cakes',
      stock: stock !== undefined && stock !== '' ? Number(stock) : 0,
      description: description || 'No description provided',
      isBestSeller: isBestSeller || false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, stock, isBestSeller } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Defensive check for corrupted reviews field
      if (!Array.isArray(product.reviews)) {
        product.reviews = [];
        product.numReviews = 0;
      }

      product.name = name || product.name;
      product.price = price !== undefined && price !== '' ? Number(price) : product.price;
      product.description = description || product.description || 'No description provided';
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.stock = stock !== undefined && stock !== '' ? Number(stock) : product.stock;
      product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Ensure reviews is an array
      if (!Array.isArray(product.reviews)) {
        product.reviews = [];
      }

      const userId = req.user._id ? req.user._id.toString() : req.user.id ? req.user.id.toString() : null;
      
      if (!userId) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      const alreadyReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === userId
      );

      if (alreadyReviewed) {
        alreadyReviewed.rating = Number(rating);
      } else {
        const review = {
          name: req.user.name || 'Anonymous',
          rating: Number(rating),
          user: userId,
        };
        product.reviews.push(review);
      }

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Review Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductCategories,
};
