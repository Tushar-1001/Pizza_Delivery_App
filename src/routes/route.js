const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const pizzaController = require("../controllers/pizzaController");
const middleware = require("../middlewares/auth");

//User's APIs...
router.post("/register", userController.userCreation);
router.post("/login", userController.userLogin);

//Pizza APIs...
router.post("/pizza", pizzaController.createPizza);
router.get("/pizzaList", pizzaController.getPizzaList);
router.get("/pizza/:pizzaId", pizzaController.getPizzaById);

//Order APIs...
router.post("/placeOrder/:userId",middleware.userAuth,orderController.placeOrder);
router.get("/orders/:id", orderController.fetchOrderDetailsbyId);
router.get("/orders/user/:userId", orderController.getUserOrders);

module.exports = router;
