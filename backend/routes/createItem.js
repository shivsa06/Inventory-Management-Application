const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.post("/create", (req, res) => {
  const { name, price, type_id } = req.body;

  if (!name || !price || !type_id) {
    return res
      .status(400)
      .json({ error: "Name, price, and type_id are required" });
  }
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }
  if (isNaN(type_id) || type_id <= 0) {
    return res.status(400).json({ error: "Invalid type_id" });
  }

  const selectTypeId = "SELECT type_id FROM ItemTypes WHERE type_id = ?";
  const insertQuery =
    "INSERT INTO Items (name, price, type_id) VALUES (?, ?, ?)";

  db.query(selectTypeId, [type_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid type_id: Item type does not exist" });
    }

    db.query(insertQuery, [name, price, type_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      res
        .status(201)
        .json({ message: "Item created", item_id: result.insertId });
    });
  });
});

module.exports = router;
