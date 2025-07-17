const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const user = await User.createUser(req.body);
    const token = jwt.sign(
      {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ message: "Mijoz ro'yxatdan o'tdi", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ro'yxatdan o'tishda xatolik!" });
  }
};

// loginUser funksiyasini ALohida fayldan olamiz
const loginUser = require("./users/loginUser");

module.exports = { registerUser, loginUser };
