const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const createOrder = require("../controllers/orders/createOrder");
const getAllOrders = require("../controllers/orders/getAllOrders");
const getMyOrders = require("../controllers/orders/getMyOrders");
const getDriverOrders = require("../controllers/orders/getDriverOrders");
const acceptOrder = require("../controllers/orders/acceptOrder");
const rejectOrder = require("../controllers/orders/rejectOrder");
const completeOrder = require("../controllers/orders/completeOrder");
const getPendingOrders = require('../controllers/orders/getPendingOrders');

// Routes
router.post("/", authenticate, createOrder);
router.get("/", authenticate, getAllOrders);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/driver", authenticate, getDriverOrders);
router.patch("/:id/accept", authenticate, acceptOrder);
router.patch("/:id/reject", authenticate, rejectOrder);
router.post("/complete/:id", authenticate, completeOrder);
router.get('/pending', getPendingOrders);

module.exports = router;
