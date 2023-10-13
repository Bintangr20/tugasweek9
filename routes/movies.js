var express = require('express');
var router = express.Router();
var pool = require('../db/queries');
var auth = require('../middleware/authenticateToken');

// Endpoint get movies gunakan pagination
router.get("/",auth , (req, res) => {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;

  pool.query(
    "SELECT * FROM movies ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json(result.rows);
    }
  );
});

// Endpoint movieId
router.get("/:id",auth, (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM movies WHERE id = $1", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(result.rows[0]); // Mengembalikan film yang sesuai dengan ID
  });
});

// Endpoint post movie
router.post("/", auth,  (req, res) => {
  const { id, title, genres, year } = req.body;

  pool.query(
    "INSERT INTO movies (id, title, genres, year) VALUES ($1, $2, $3, $4)",
    [id, title, genres, year],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Movie created successfully" });
    }
  );
});

// Endpoint put movie
router.put("/:id", auth, (req, res) => {
  const id = req.params.id;
  const { title, genres, year } = req.body;

  pool.query(
    "UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4",
    [title, genres, year, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(200).json({ message: "Movie updated successfully" });
    }
  );
});

// Enpoint delete movies
router.delete("/:id", auth,  (req, res) => {
  const id = req.params.id;

  pool.query("DELETE FROM movies WHERE id = $1", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  });
});

module.exports = router;
