const pool = require("../../config/db");

module.exports = async function updateProfile(req, res) {
  const userId = req.user.id;
  const { full_name, email, phone } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET full_name = $1, email = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING id, full_name, email, phone`,
      [full_name, email, phone, userId]
    );

    res.json({ message: "Profil yangilandi", user: result.rows[0] });
  } catch (error) {
    console.error("Profilni yangilashda xatolik:", error);
    res.status(500).json({ error: "Profil yangilanmadi" });
  }
};
