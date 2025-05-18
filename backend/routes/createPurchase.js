const express = require("express");
const db = require("../config/database");
const router = express.Router();

router.post("/createPurchase", (req, res) => {
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

  for (let item of items) {
    if (
      !item.item_id ||
      item.quantity === undefined ||
      isNaN(item.quantity) ||
      item.quantity <= 0
    ) {
      return res.status(400).json({ error: "Invalid item data" });
    }
  }

  let total_amount = 0;
  const itemIds = items.map((item) => item.item_id);

  db.query(
    "SELECT item_id, price, (SELECT quantity FROM Inventory WHERE item_id = Items.item_id) AS quantity FROM Items WHERE item_id IN (?)",
    [itemIds],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      const validItemIds = results.map((row) => row.item_id);
      const invalidIds = itemIds.filter((id) => !validItemIds.includes(id));
      if (invalidIds.length > 0) {
        return res
          .status(400)
          .json({ error: `Invalid item_ids: ${invalidIds.join(", ")}` });
      }

      const priceMap = {};
      const inventoryMap = {};
      results.forEach((row) => {
        priceMap[row.item_id] = row.price;
        inventoryMap[row.item_id] = row.quantity || 0;
      });

      for (let item of items) {
        if (inventoryMap[item.item_id] < item.quantity) {
          return res.status(400).json({ error: "Insufficient stock" });
        }
        total_amount += priceMap[item.item_id] * item.quantity;
      }

      db.query(
        "INSERT INTO Purchases (customer_name, purchase_date, total_amount) VALUES (?, ?, ?)",
        [customer_name, purchase_date, total_amount],
        (err, purchaseResult) => {
          if (err) {
            return res.status(500).json({ error: "Database error" });
          }
          const purchase_id = purchaseResult.insertId;

          let detailQueriesCompleted = 0;
          items.forEach((item) => {
            const subtotal = priceMap[item.item_id] * item.quantity;
            db.query(
              "INSERT INTO PurchaseDetails (purchase_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)",
              [purchase_id, item.item_id, item.quantity, subtotal],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: "Database error" });
                }
                detailQueriesCompleted++;
                if (detailQueriesCompleted === items.length) {
                  let inventoryQueriesCompleted = 0;
                  items.forEach((item) => {
                    db.query(
                      "UPDATE Inventory SET quantity = quantity - ? WHERE item_id = ?",
                      [item.quantity, item.item_id],
                      (err) => {
                        if (err) {
                          return res
                            .status(500)
                            .json({ error: "Database error" });
                        }
                        inventoryQueriesCompleted++;
                        if (inventoryQueriesCompleted === items.length) {
                          res
                            .status(201)
                            .json({ message: "Purchase created", purchase_id });
                        }
                      }
                    );
                  });
                }
              }
            );
          });
        }
      );
    }
  );
});

module.exports = router;
