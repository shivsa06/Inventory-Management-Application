const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.put("/details/:detail_id", (req, res) => {
  const { detail_id } = req.params;
  const { quantity } = req.body;

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  const selectQuery = `SELECT pd.purchase_id, pd.item_id, pd.quantity AS old_quantity, i.price, inv.quantity AS stock FROM PurchaseDetails pd JOIN Items i ON pd.item_id = i.item_id JOIN Inventory inv ON pd.item_id = inv.item_id WHERE pd.detail_id = ?`;
  const updatePurchaseDetails =
    "UPDATE PurchaseDetails SET quantity = ?, subtotal = ? WHERE detail_id = ?";
  const updateInventory =
    "UPDATE Inventory SET quantity = quantity - ? WHERE item_id = ?";
  const subTotal =
    "SELECT SUM(subtotal) as total FROM PurchaseDetails WHERE purchase_id = ?";
  const updatePurchase =
    "UPDATE Purchases SET total_amount = ? WHERE purchase_id = ?";

  db.query(selectQuery, [detail_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!results.length) {
      return res.status(404).json({ error: "Purchase detail not found" });
    }

    const { purchase_id, item_id, old_quantity, price, stock } = results[0];
    const quantityChange = quantity - old_quantity;

    if (stock - quantityChange < 0) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const newSubtotal = price * quantity;
    db.query(
      updatePurchaseDetails,
      [quantity, newSubtotal, detail_id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        db.query(updateInventory, [quantityChange, item_id], (err) => {
          if (err) {
            return res.status(500).json({ error: "Database error" });
          }

          db.query(subTotal, [purchase_id], (err, details) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }
            const newTotal = Number(details[0].total) || 0;

            db.query(updatePurchase, [newTotal, purchase_id], (err) => {
              if (err) {
                return res.status(500).json({ error: "Database error" });
              }
              res.status(200).json({ message: "Purchase detail updated" });
            });
          });
        });
      }
    );
  });
});

module.exports = router;
