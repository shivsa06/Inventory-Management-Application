const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.get("/getItemTypes", (req, res) => {
  const query = "SELECT type_id, type_name FROM ItemTypes";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    res.status(200).json({ itemTypes: results });
  });
});

module.exports = router;
