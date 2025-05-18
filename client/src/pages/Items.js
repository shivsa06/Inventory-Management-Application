import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { getItems } from "../services/api";
import ItemForm from "../components/ItemForm";
import DataTable from "../components/Table";
import "../styles/App.css";

const Items = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    getItems()
      .then((response) => {
        setItems(response.data.items || []);
        setError("");
      })
      .catch((err) => {
        setError(
          "Failed to fetch items: " + (err.response?.data?.error || err.message)
        );
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
        sx={{ fontWeight: 600, color: "#2c3e50" }}
      >
        Manage Items
      </Typography>
      <ItemForm onItemAdded={fetchItems} />
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      {items.length === 0 && !error ? (
        <Typography sx={{ my: 2, color: "#7f8c8d" }}>
          No items found. Add an item to get started.
        </Typography>
      ) : (
        <Box sx={{ marginTop: "30px" }}>
          <DataTable data={items} onUpdate={fetchItems} onDelete={fetchItems} />
        </Box>
      )}
    </Box>
  );
};

export default Items;
