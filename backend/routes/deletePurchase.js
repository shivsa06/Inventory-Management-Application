const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.delete("/:purchase_id", (req, res) => {
  const purchase_id = req.params.purchase_id;

  if (isNaN(purchase_id) || purchase_id <= 0) {
    return res.status(400).json({ error: "Invalid purchase_id" });
  }

  db.query(
    "SELECT purchase_id FROM Purchases WHERE purchase_id = ?",
    [purchase_id],
    (err, purchaseResults) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error", details: err.message });
      }
      if (purchaseResults.length === 0) {
        return res.status(404).json({ error: "Purchase not found" });
      }

      db.query(
        "SELECT item_id, quantity FROM PurchaseDetails WHERE purchase_id = ?",
        [purchase_id],
        (err, details) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Database error", details: err.message });
          }

          let inventoryQueriesCompleted = 0;
          if (details.length === 0) {
            proceedWithDeletion();
          } else {
            details.forEach((detail) => {
              db.query(
                "UPDATE Inventory SET quantity = quantity + ? WHERE item_id = ?",
                [detail.quantity, detail.item_id],
                (err) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Database error", details: err.message });
                  }
                  inventoryQueriesCompleted++;
                  if (inventoryQueriesCompleted === details.length) {
                    proceedWithDeletion();
                  }
                }
              );
            });
          }

          function proceedWithDeletion() {
            db.query(
              "DELETE FROM PurchaseDetails WHERE purchase_id = ?",
              [purchase_id],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Database error", details: err.message });
                }

                db.query(
                  "DELETE FROM Purchases WHERE purchase_id = ?",
                  [purchase_id],
                  (err) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({
                          error: "Database error",
                          details: err.message,
                        });
                    }

                    res
                      .status(200)
                      .json({ message: "Purchase deleted", purchase_id });
                  }
                );
              }
            );
          }
        }
      );
    }
  );
});

module.exports = router;
