import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/App.css";

const PurchaseForm = ({ onPurchaseAdded }) => {
  const [customerName, setCustomerName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [items, setItems] = useState([{ item_id: "", quantity: 1 }]);
  const [availableItems, setAvailableItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:1111/inventory/getInventory")
      .then((response) => {
        if (response.data.inventory && Array.isArray(response.data.inventory)) {
          axios
            .get("http://localhost:1111/items/getItem")
            .then((itemResponse) => {
              const itemsWithDetails = response.data.inventory.map((inv) => {
                const item = itemResponse.data.items.find(
                  (i) => i.item_id === inv.item_id
                );
                return {
                  ...inv,
                  name: item?.name || "Unknown Item",
                  price: item?.price || 0,
                };
              });
              setAvailableItems(itemsWithDetails);
              if (itemsWithDetails.length === 0) {
                setError("No valid items found in inventory");
              }
            })
            .catch((err) => {
              console.error("Failed to fetch items:", err);
              setError("Failed to validate items");
            });
        } else {
          setError("No inventory items found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch inventory:", err);
        setError("Failed to fetch items");
        setLoading(false);
      });
  }, []);

  const addItemRow = () => {
    setItems([...items, { item_id: "", quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === "quantity") {
      const parsedQuantity = parseInt(value) || 1;
      const itemId = newItems[index].item_id;
      if (itemId) {
        const stock =
          availableItems.find((avail) => avail.item_id === itemId)?.quantity ||
          0;
        if (parsedQuantity > stock) {
          Swal.fire({
            icon: "error",
            title: "Insufficient Stock",
            text: `Cannot select more than ${stock} for ${
              availableItems.find((avail) => avail.item_id === itemId)?.name ||
              "this item"
            }.`,
          });
          return;
        }
      }
      newItems[index][field] = parsedQuantity;
    } else {
      newItems[index][field] = parseInt(value) || "";
    }
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !customerName ||
      !purchaseDate ||
      items.some((item) => !item.item_id || item.quantity <= 0)
    ) {
      setError("All fields are required and quantities must be positive");
      return;
    }

    // Validate stock for all items before submitting
    for (const item of items) {
      const stock =
        availableItems.find((avail) => avail.item_id === item.item_id)
          ?.quantity || 0;
      if (item.quantity > stock) {
        Swal.fire({
          icon: "error",
          title: "Insufficient Stock",
          text: `Cannot select more than ${stock} for ${
            availableItems.find((avail) => avail.item_id === item.item_id)
              ?.name || "this item"
          }.`,
        });
        return;
      }
    }

    axios
      .post("http://localhost:1111/purchases/createPurchase", {
        customer_name: customerName,
        purchase_date: purchaseDate,
        items,
      })
      .then((response) => {
        setCustomerName("");
        setPurchaseDate("");
        setItems([{ item_id: "", quantity: 1 }]);
        setError("");
        if (onPurchaseAdded) onPurchaseAdded();
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to add purchase");
      });
  };

  return (
    <Box className="app-container" sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 500, color: "#2c3e50" }}
      >
        Add New Purchase
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <TextField
          label="Purchase Date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <Table sx={{ mt: 2, mb: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={`item-row-${index}`}>
                <TableCell sx={{ minWidth: "300px" }}>
                  <TextField
                    select
                    value={item.item_id || ""}
                    onChange={(e) =>
                      updateItem(index, "item_id", e.target.value)
                    }
                    fullWidth
                    disabled={loading || availableItems.length === 0}
                    SelectProps={{ displayEmpty: true }}
                    label="Item"
                    sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
                  >
                    {availableItems.length === 0 ? (
                      <MenuItem value="" disabled>
                        {loading ? "Loading items..." : "No items available"}
                      </MenuItem>
                    ) : (
                      availableItems.map((avail, idx) => (
                        <MenuItem
                          key={`avail-item-${avail.item_id}-${idx}`}
                          value={avail.item_id}
                        >
                          {avail.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    fullWidth
                    inputProps={{ min: 1 }}
                    sx={{
                      maxWidth: "150px",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => removeItemRow(index)}
                    disabled={items.length === 1}
                  >
                    <Remove />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            onClick={addItemRow}
            startIcon={<Add />}
            variant="outlined"
            color="primary"
            sx={{ flex: 1, borderRadius: "8px" }}
          >
            Add Item
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1, borderRadius: "8px" }}
          >
            Add Purchase
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default PurchaseForm;
