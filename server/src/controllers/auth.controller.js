exports.login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND is_active=true",
      [email]
    );

    console.log("DB RESULT:", result.rows.length);

    const user = result.rows[0];

    console.log("HASH EXISTS:", !!user.password_hash);

    const isMatch = await comparePassword(password, user.password_hash);

    console.log("PASSWORD MATCH:", isMatch);

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
