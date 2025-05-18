const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.put("/:item_id", (req, res) => {
  const item_id = req.params.item_id;
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
  if (isNaN(item_id) || item_id <= 0) {
    return res.status(400).json({ error: "Invalid item_id" });
  }

  const selectTypeId = "SELECT type_id FROM ItemTypes WHERE type_id = ?";
  const selectItemId = "SELECT item_id FROM Items WHERE item_id = ?";
  const updateItem =
    "UPDATE Items SET name = ?, price = ?, type_id = ? WHERE item_id = ?";

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

    db.query(selectItemId, [item_id], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      db.query(updateItem, [name, price, type_id, item_id], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json({ message: "Item updated" });
      });
    });
  });
});

module.exports = router;
