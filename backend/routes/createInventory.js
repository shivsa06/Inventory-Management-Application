const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.post("/createInventory", (req, res) => {
  const { item_id, quantity } = req.body;

  if (!item_id || quantity === undefined) {
    return res.status(400).json({ error: "Item_id and quantity are required" });
  }
  if (isNaN(item_id) || item_id <= 0) {
    return res.status(400).json({ error: "Invalid item_id" });
  }
  if (isNaN(quantity) || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a non-negative number" });
  }

  const selectItem = "SELECT item_id FROM Items WHERE item_id = ?";
  const insertInventory =
    "INSERT INTO Inventory (item_id, quantity) VALUES (?, ?)";

  db.query(selectItem, [item_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid item_id: Item does not exist" });
    }

    db.query(insertInventory, [item_id, quantity], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      res.status(201).json({
        message: "Inventory created",
        inventory_id: result.insertId,
      });
    });
  });
});

module.exports = router;
