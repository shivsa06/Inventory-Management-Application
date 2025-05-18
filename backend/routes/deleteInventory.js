const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.delete("/:inventory_id", (req, res) => {
  const inventory_id = req.params.inventory_id;

  if (isNaN(inventory_id) || inventory_id <= 0) {
    return res.status(400).json({ error: "Invalid inventory_id" });
  }

  const checkInventory =
    "SELECT inventory_id FROM Inventory WHERE inventory_id = ?";
  const deleteQuery = "DELETE FROM Inventory WHERE inventory_id = ?";

  db.query(checkInventory, [inventory_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    db.query(deleteQuery, [inventory_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Inventory not found" });
      }
      res.status(200).json({ message: "Inventory deleted" });
    });
  });
});

module.exports = router;
