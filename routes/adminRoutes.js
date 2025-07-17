const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const getActionLogs = require("../controllers/admin/getActionLogs");

// controllerlar
const getAllUsers = require("../controllers/admin/getAllUsers");
const getAllDrivers = require("../controllers/admin/getAllDrivers");
const getAllOrders = require("../controllers/admin/getAllOrders");
const blockUser = require("../controllers/admin/blockUser");
const getStats = require("../controllers/admin/getStats");

// faqat adminlar kirishi mumkin
router.use(authenticate, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/drivers", getAllDrivers);
router.get("/orders", getAllOrders);
router.patch("/block-user/:id", blockUser);
router.get("/stats", getStats);
router.get("/logs", getActionLogs);

module.exports = router;
