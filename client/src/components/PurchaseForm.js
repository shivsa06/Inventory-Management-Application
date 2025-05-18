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
import { createPurchase, getInventory, getItems } from "../services/api";
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
    getInventory()
      .then((response) => {
        if (response.data.inventory && Array.isArray(response.data.inventory)) {
          getItems()
            .then((itemResponse) => {
              const validItemIds = itemResponse.data.items.map(
                (item) => item.item_id
              );
              const filteredInventory = response.data.inventory.filter((inv) =>
                validItemIds.includes(inv.item_id)
              );
              setAvailableItems(filteredInventory);
              if (filteredInventory.length === 0) {
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
    newItems[index][field] =
      field === "item_id" ? parseInt(value) : parseInt(value) || 1;
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
    createPurchase({
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
                <TableCell>
                  <TextField
                    select
                    value={item.item_id || ""}
                    onChange={(e) =>
                      updateItem(index, "item_id", e.target.value)
                    }
                    fullWidth
                    disabled={loading || availableItems.length === 0}
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
                          {avail.name} (Stock: {avail.quantity}, Price: ₹
                          {avail.price})
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
            sx={{ flex: 1 }}
          >
            Add Item
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1 }}
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
