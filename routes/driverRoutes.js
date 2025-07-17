const express = require("express");
const router = express.Router();

const registerDriver = require("../controllers/drivers/registerDriver");
const loginDriver = require("../controllers/drivers/loginDriver");

router.post("/register", registerDriver);
router.post("/login", loginDriver);

module.exports = router;
