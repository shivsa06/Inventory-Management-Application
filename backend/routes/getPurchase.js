const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.get("/getPurchase", (req, res) => {
  const query = `
    SELECT 
        p.purchase_id, p.customer_name, p.purchase_date, p.total_amount,
        pd.detail_id, pd.item_id, pd.quantity, pd.subtotal,
        i.name AS item_name, i.price
    FROM Purchases p
    LEFT JOIN PurchaseDetails pd ON p.purchase_id = pd.purchase_id
    LEFT JOIN Items i ON pd.item_id = i.item_id
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }

    const purchases = {};
    results.forEach((row) => {
      if (!purchases[row.purchase_id]) {
        purchases[row.purchase_id] = {
          purchase_id: row.purchase_id,
          customer_name: row.customer_name,
          purchase_date: row.purchase_date,
          total_amount: row.total_amount,
          items: [],
        };
      }
      if (row.item_id) {
        purchases[row.purchase_id].items.push({
          detail_id: row.detail_id,
          item_id: row.item_id,
          item_name: row.item_name,
          quantity: row.quantity,
          subtotal: row.subtotal,
          price: row.price,
        });
      }
    });

    res.status(200).json({ purchases: Object.values(purchases) });
  });
});

module.exports = router;
