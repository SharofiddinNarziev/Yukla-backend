// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

// Mijozni ro'yxatdan o'tkazish
router.post("/register", registerUser);

// Mijozni tizimga kiritish
router.post("/login", loginUser);

module.exports = router;
