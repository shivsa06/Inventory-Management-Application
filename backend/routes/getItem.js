const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.get("/getItem", (req, res) => {
  const query =
    "SELECT i.item_id, i.name, i.price, i.type_id, t.type_name FROM Items i JOIN ItemTypes t ON i.type_id = t.type_id";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    res.status(200).json({ items: results });
  });
});

module.exports = router;
