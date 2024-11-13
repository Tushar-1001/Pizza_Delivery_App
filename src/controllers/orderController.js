const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const pizzaModel = require("../models/pizzaModel");
const validator = require("../utils/validator");

const placeOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { pizzaItems, deliveryAddress, size } = req.body;
    let userIdFromToken = req.userId;

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "User ID is required" });
    }

    // Check if the user exists
    const userExists = await userModel.findById(userId);
    if (!userExists) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    //Authentication & authorization
    if (userExists._id.toString() != userIdFromToken) {
      res.status(401).send({
        status: false,
        message: `Unauthorized access! User's info doesn't match`,
      });
      return;
    }

    if (!pizzaItems || !Array.isArray(pizzaItems) || pizzaItems.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Pizza items are required" });
    }

    let totalPrice = 0;

    for (let item of pizzaItems) {
      if (!item.pizzaId || !item.quantity || !item.size) {
        return res.status(400).send({
          status: false,
          message:
            "Each pizza item must include a pizza ID, quantity, and size",
        });
      }

      const pizzaExists = await pizzaModel.findById(item.pizzaId);
      if (!pizzaExists) {
        return res.status(400).send({
          status: false,
          message: `Pizza ID ${item.pizzaId} not found`,
        });
      }

      // Check if the size is available for the pizza
      const pizzaSize = pizzaExists.size_price[0];
      const pizzaPrice = pizzaSize[item.size];

      if (!pizzaPrice) {
        return res.status(400).send({
          status: false,
          message: `Size ${item.size} is not available for pizza ${pizzaExists.name}`,
        });
      }

      // Calculate the price for this pizza item and add to total price
      totalPrice += pizzaPrice * item.quantity;
    }

    // Validate delivery address
    if (!validator.isValid(deliveryAddress)) {
      return res
        .status(400)
        .send({ status: false, message: "Delivery address is required" });
    }

    const orderData = {
      userId,
      pizzaItems,
      deliveryAddress,
      totalPrice,
      status: "Pending",
      size,
    };

    const newOrder = await orderModel.create(orderData);
    return res.status(201).send({
      status: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Error occurred: " + err.message,
    });
  }
};

const fetchOrderDetailsbyId = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res
        .status(400)
        .send({ status: false, message: "Order ID is required" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).send({
        status: false,
        message: `Order with ID ${orderId} not found`,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Order details fetched successfully",
      data: {
        order,
        // totalPrice: totalOrderPrice,
      },
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Error occurred: " + err.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({
        status: false,
        message: "User ID is required",
      });
    }

    // Find all orders for the given userId
    const orders = await orderModel.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).send({
        status: false,
        message: `No orders found for user with ID ${userId}`,
      });
    }

    const formattedOrders = orders.map((order) => ({
      totalPrice: order.totalPrice,
      deliveryAddress: order.deliveryAddress,
      status: order.status,
      pizzaItems: order.pizzaItems.map((item) => ({
        pizzaName: item.pizzaId.name,
        pizzaDescription: item.pizzaId.description,
        quantity: item.quantity,
        size: item.size,
      })),
    }));

    return res.status(200).send({
      status: true,
      message: "Orders fetched successfully",
      data: formattedOrders,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Error occurred: " + err.message,
    });
  }
};

module.exports = {
  placeOrder,
  fetchOrderDetailsbyId,
  getUserOrders,
};
