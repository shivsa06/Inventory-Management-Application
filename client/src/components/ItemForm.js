import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { createItem, getItemTypes } from '../services/api';
import "../styles/App.css";

const ItemForm = ({ onItemAdded }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [typeId, setTypeId] = useState("");
  const [itemTypes, setItemTypes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getItemTypes()
      .then((response) => {
        const types = response.data.itemTypes || [];
        setItemTypes(types);
        if (types.length > 0) setTypeId(types[0].type_id);
        setError(
          types.length === 0
            ? "No item types found. Please add item types in the database."
            : ""
        );
      })
      .catch((err) => {
        setError(
          "Failed to fetch item types: " +
            (err.response?.data?.error || err.message)
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !typeId) {
      setError("All fields are required");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError("Price must be a positive number");
      return;
    }
    createItem({
      name,
      price: parseFloat(price),
      type_id: parseInt(typeId),
    })
      .then((response) => {
        setName("");
        setPrice("");
        setTypeId(itemTypes.length > 0 ? itemTypes[0].type_id : "");
        setError("");
        if (onItemAdded) onItemAdded();
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to add item");
      });
  };

  return (
    <Box className="app-container" sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add New Item
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ min: 0, step: "0.01" }}
        />
        <TextField
          select
          label="Item Type"
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          fullWidth
          margin="normal"
          required
          disabled={isLoading || itemTypes.length === 0}
        >
          {itemTypes.length > 0 ? (
            itemTypes.map((type) => (
              <MenuItem key={type.type_id} value={type.type_id}>
                {type.type_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              {isLoading ? "Loading item types..." : "No item types available"}
            </MenuItem>
          )}
        </TextField>
        {error && (
          <Typography color="error" sx={{ my: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isLoading || itemTypes.length === 0}
        >
          Add Item
        </Button>
      </form>
    </Box>
  );
};

export default ItemForm;
