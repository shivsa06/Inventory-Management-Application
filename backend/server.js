const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const createItem = require("./routes/createItem");
const getItem = require("./routes/getItem");
const getItemTypes = require("./routes/getItemType");
const updateItem = require("./routes/updateItem");
const deleteItem = require("./routes/deleteItem");

const createInventory = require("./routes/createInventory");
const getInventory = require("./routes/getInventory");
const updateInventory = require("./routes/updateInventory");
const deleteInventory = require("./routes/deleteInventory");

const createPurchase = require("./routes/createPurchase");
const getPurchase = require("./routes/getPurchase");
const updatePurchase = require("./routes/updatePurchase");
const deletePurchase = require("./routes/deletePurchase");
const deletePurchaseDetail = require("./routes/deletePurchaseDetail");
const updatePurchaseDetail = require("./routes/updatePurchaseDetails");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const itemRouter = express.Router();
itemRouter.post("/create", createItem);
itemRouter.get("/getItem", getItem);
itemRouter.get("/getItemTypes", getItemTypes);
itemRouter.put("/:item_id", updateItem);
itemRouter.delete("/:item_id", deleteItem);

const inventoryRouter = express.Router();
inventoryRouter.post("/createInventory", createInventory);
inventoryRouter.get("/getInventory", getInventory);
inventoryRouter.put("/:inventory_id", updateInventory);
inventoryRouter.delete("/:inventory_id", deleteInventory);

const purchaseRouter = express.Router();
purchaseRouter.post("/createPurchase", createPurchase);
purchaseRouter.get("/getPurchase", getPurchase);
purchaseRouter.put("/:purchase_id", updatePurchase);
purchaseRouter.put("/details/:detail_id", updatePurchaseDetail);
purchaseRouter.delete("/:purchase_id", deletePurchase);
purchaseRouter.delete("/details/:detail_id", deletePurchaseDetail);

app.use("/items", itemRouter);
app.use("/inventory", inventoryRouter);
app.use("/purchases", purchaseRouter);

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
  console.log(`Server Running at PORT: ${PORT}`);
});
