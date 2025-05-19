import React, { useState, useEffect } from "react";
import { Box, TextField, Button, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import DataTable from "../components/Table";
import "../styles/App.css";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchItems();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:1111/inventory/getInventory")
      .then((response) => {
        setInventory(response.data.inventory);
      })
      .catch(() => {
        setError("Failed to fetch inventory");
      });
  };

  const fetchItems = () => {
    axios
      .get("http://localhost:1111/items/getItem")
      .then((response) => {
        setItems(response.data.items);
      })
      .catch(() => {
        setError("Failed to fetch items");
      });
  };

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!itemId || quantity === "") {
      setError("Item and quantity are required");
      return;
    }
    axios
      .post("http://localhost:1111/inventory/createInventory", {
        item_id: parseInt(itemId),
        quantity: parseInt(quantity),
      })
      .then(() => {
        setItemId("");
        setQuantity("");
        setError("");
        fetchInventory();
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to add inventory");
      });
  };

  return (
    <Box
      className="app-container"
      sx={{
        marginTop: "100px",
        padding: "30px",
        backgroundColor: "#f4f6f8",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#34495e" }}
      >
        Manage Inventory
      </Typography>
      <form onSubmit={handleAddInventory}>
        <TextField
          select
          label="Item"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
        >
          {items.map((item) => (
            <MenuItem key={item.item_id} value={item.item_id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "16px", padding: "10px 20px", borderRadius: "8px" }}
        >
          Add Inventory
        </Button>
      </form>
      <Box sx={{ marginTop: "30px" }}>
        <DataTable
          data={inventory}
          onUpdate={fetchInventory}
          onDelete={fetchInventory}
          editableColumns={["quantity"]}
        />
      </Box>
    </Box>
  );
};

export default Inventory;
