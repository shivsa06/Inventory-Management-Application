const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.get("/getInventory", (req, res) => {
  const query = `
        SELECT inv.inventory_id, inv.item_id, i.name, i.price, it.type_name, inv.quantity 
        FROM Inventory inv 
        JOIN Items i ON inv.item_id = i.item_id
        JOIN ItemTypes it ON i.type_id = it.type_id
    `;
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    res.status(200).json({ inventory: results });
  });
});

module.exports = router;
