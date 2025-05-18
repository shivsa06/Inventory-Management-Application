const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.delete("/:item_id", (req, res) => {
  const item_id = req.params.item_id;

  if (isNaN(item_id) || item_id <= 0) {
    return res.status(400).json({ error: "Invalid item_id" });
  }

  const checkItem = "SELECT item_id FROM Items WHERE item_id = ?";
  const deleteQuery = "DELETE FROM Items WHERE item_id = ?";

  db.query(checkItem, [item_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    db.query(deleteQuery, [item_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json({ message: "Item deleted" });
    });
  });
});

module.exports = router;
