const express = require("express");
const router = express.Router();
const {
  clientRegister,
  clientLogin,
  driverRegister,
  driverLogin
} = require("../controllers/authController");

router.post("/client/register", clientRegister);
router.post("/client/login", clientLogin);

router.post("/driver/register", driverRegister);
router.post("/driver/login", driverLogin);

module.exports = router;
