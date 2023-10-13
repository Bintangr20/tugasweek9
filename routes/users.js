var express = require("express");
var router = express.Router();
var { signToken } = require("../utils/auth.js");

var pool = require("../db/queries.js");

// Endpoint register
router.post("/register", (req, res) => {
  const { id,email, password, role } = req.body;

  // Cek apakah sudah pernah terdaftar
  pool.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Kalau belum terdaftar,daftarkan kedalam list users di database
    pool.query(
      "INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)",
      [id, email, password, role],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

//Endpoint Login untuk mendapatkan token
router.post("/login", (req, res) => {
  pool.query(
    `SELECT * FROM users WHERE email = $1 AND password = $2`,
    [req.body.email, req.body.password],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        const token = signToken(results.rows[0]);
        res.json({
          token: token,
        });
      }
    }
  );
});

// Endpoint get users gunakan pagination
router.get("/", (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  pool.query(
    "SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(result.rows);
    }
  );
});

module.exports = router;
