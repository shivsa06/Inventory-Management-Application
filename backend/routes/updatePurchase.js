const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.put("/:purchase_id", (req, res) => {
  const purchase_id = req.params.purchase_id;
  const { customer_name, purchase_date, items } = req.body;

  if (
    !customer_name ||
    !purchase_date ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  if (isNaN(purchase_id) || purchase_id <= 0) {
    return res.status(400).json({ error: "Invalid purchase_id" });
  }

  const selectPurchaseId =
    "SELECT purchase_id FROM Purchases WHERE purchase_id = ?";
  const selectItemId =
    "SELECT i.item_id, i.price, inv.quantity AS stock FROM Items i JOIN Inventory inv ON i.item_id = inv.item_id WHERE i.item_id IN (?)";
  const selectItemQuantity =
    "SELECT item_id, quantity FROM PurchaseDetails WHERE purchase_id = ?";
  const updateInventory =
    "UPDATE Inventory SET quantity = quantity + ? WHERE item_id = ?";
  const deletePurchaseDetails =
    "DELETE FROM PurchaseDetails WHERE purchase_id = ?";
  const insertIntoPurchaseDetails =
    "INSERT INTO PurchaseDetails (purchase_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)";
  const updateInventoryQuantity =
    "UPDATE Inventory SET quantity = quantity - ? WHERE item_id = ?";
  const updatePurchaseCustomer =
    "UPDATE Purchases SET customer_name = ?, purchase_date = ?, total_amount = ? WHERE purchase_id = ?";

  db.query(selectPurchaseId, [purchase_id], (err, purchaseResults) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (purchaseResults.length === 0) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    const itemIds = items.map((item) => item.item_id);
    db.query(selectItemId, [itemIds], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length !== itemIds.length) {
        return res.status(400).json({ error: "Invalid item_ids" });
      }

      let total_amount = 0;
      const priceMap = {};
      const inventoryMap = {};
      results.forEach((row) => {
        priceMap[row.item_id] = row.price;
        inventoryMap[row.item_id] = row.stock;
      });

      for (let item of items) {
        if (
          !inventoryMap[item.item_id] ||
          inventoryMap[item.item_id] < item.quantity
        ) {
          return res.status(400).json({ error: "Insufficient stock" });
        }
        total_amount += priceMap[item.item_id] * item.quantity;
      }

      db.query(selectItemQuantity, [purchase_id], (err, oldDetails) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        let restoreQueriesCompleted = 0;
        if (oldDetails.length === 0) {
          proceedWithDeletion();
        } else {
          oldDetails.forEach((detail) => {
            db.query(
              updateInventory,
              [detail.quantity, detail.item_id],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: "Database error" });
                }
                restoreQueriesCompleted++;
                if (restoreQueriesCompleted === oldDetails.length) {
                  proceedWithDeletion();
                }
              }
            );
          });
        }

        function proceedWithDeletion() {
          db.query(deletePurchaseDetails, [purchase_id], (err) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }

            let detailQueriesCompleted = 0;
            items.forEach((item) => {
              const subtotal = priceMap[item.item_id] * item.quantity;
              db.query(
                insertIntoPurchaseDetails,
                [purchase_id, item.item_id, item.quantity, subtotal],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: "Database error" });
                  }
                  detailQueriesCompleted++;
                  if (detailQueriesCompleted === items.length) {
                    let deductQueriesCompleted = 0;
                    items.forEach((item) => {
                      db.query(
                        updateInventoryQuantity,
                        [item.quantity, item.item_id],
                        (err) => {
                          if (err) {
                            return res
                              .status(500)
                              .json({ error: "Database error" });
                          }
                          deductQueriesCompleted++;
                          if (deductQueriesCompleted === items.length) {
                            db.query(
                              updatePurchaseCustomer,
                              [
                                customer_name,
                                purchase_date,
                                total_amount,
                                purchase_id,
                              ],
                              (err) => {
                                if (err) {
                                  return res
                                    .status(500)
                                    .json({ error: "Database error" });
                                }
                                res.status(200).json({
                                  message: "Purchase updated",
                                  purchase_id,
                                });
                              }
                            );
                          }
                        }
                      );
                    });
                  }
                }
              );
            });
          });
        }
      });
    });
  });
});

module.exports = router;
