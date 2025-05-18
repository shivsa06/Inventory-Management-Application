const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.put("/:inventory_id", (req, res) => {
  const inventory_id = req.params.inventory_id;
  const { item_id, quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity is required and must be non-negative" });
  }
  if (isNaN(inventory_id) || inventory_id <= 0) {
    return res.status(400).json({ error: "Invalid inventory_id" });
  }

  const checkInventory =
    "SELECT inventory_id, item_id FROM Inventory WHERE inventory_id = ?";
  const updateQuery =
    "UPDATE Inventory SET quantity = ?, item_id = ? WHERE inventory_id = ?";

  db.query(checkInventory, [inventory_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    const finalItemId = item_id || results[0].item_id;

    if (finalItemId) {
      const checkQuery = "SELECT item_id FROM Items WHERE item_id = ?";
      db.query(checkQuery, [finalItemId], (err, itemResults) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }
        if (itemResults.length === 0) {
          return res
            .status(400)
            .json({ error: "Invalid item_id: Item does not exist" });
        }

        db.query(
          updateQuery,
          [quantity, finalItemId, inventory_id],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Database error", details: err.message });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Inventory not found" });
            }
            res.status(200).json({ message: "Inventory updated" });
          }
        );
      });
    } else {
      db.query(updateQuery, [quantity, null, inventory_id], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Inventory not found" });
        }
        res.status(200).json({ message: "Inventory updated" });
      });
    }
  });
});

module.exports = router;
