const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.delete("/details/:detail_id", (req, res) => {
  const { detail_id } = req.params;

  const selectPurchaseDetailId =
    "SELECT purchase_id, item_id, quantity FROM PurchaseDetails WHERE detail_id = ?";
  const deletePurchaseDetailId =
    "DELETE FROM PurchaseDetails WHERE detail_id = ?";
  const updateInventory =
    "UPDATE Inventory SET quantity = quantity + ? WHERE item_id = ?";
  const sumOfTotal =
    "SELECT SUM(subtotal) as total FROM PurchaseDetails WHERE purchase_id = ?";
  const updatePurchase =
    "UPDATE Purchases SET total_amount = ? WHERE purchase_id = ?";

  db.query(selectPurchaseDetailId, [detail_id], (err, detail) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error", details: err.message });
    }
    if (!detail.length) {
      return res.status(404).json({ error: "Purchase detail not found" });
    }

    const { purchase_id, item_id, quantity } = detail[0];

    db.query(deletePurchaseDetailId, [detail_id], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }

      db.query(updateInventory, [quantity, item_id], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database error", details: err.message });
        }

        db.query(sumOfTotal, [purchase_id], (err, details) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Database error", details: err.message });
          }
          const newTotal = Number(details[0].total) || 0;

          db.query(updatePurchase, [newTotal, purchase_id], (err) => {
            if (err) {
              return res.status(500).json({
                error: "Database error",
                details: err.message,
              });
            }

            res.status(200).json({
              message: "Purchase detail deleted successfully",
            });
          });
        });
      });
    });
  });
});

module.exports = router;
