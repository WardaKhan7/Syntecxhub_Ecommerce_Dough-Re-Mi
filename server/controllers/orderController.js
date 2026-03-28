const Order = require('../models/Order');
const Product = require('../models/Product');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        products: orderItems,
        user: req.user._id,
        shippingAddress,
        totalAmount,
      });

      const createdOrder = await order.save();

      // Decrease stock for each product
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name imageUrl');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      // Using save with validateBeforeSave: false to handle legacy orders missing fields
      const updatedOrder = await order.save({ validateBeforeSave: false });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
