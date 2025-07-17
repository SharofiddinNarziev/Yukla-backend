const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

const updateProfile = require("../controllers/settings/updateProfile");
const changePassword = require("../controllers/settings/changePassword");
const deactivateAccount = require("../controllers/settings/deactivateAccount");

// Faqat avtorizatsiyadan o‘tgan foydalanuvchilar uchun
router.use(authenticate);

router.put("/profile", updateProfile);
router.put("/change-password", changePassword);
router.delete("/deactivate", deactivateAccount);

module.exports = router;
