import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { getPurchases } from "../services/api";
import PurchaseForm from "../components/PurchaseForm";
import DataTable from "../components/Table";
import "../styles/App.css";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = () => {
    getPurchases()
      .then((response) => {
        const formattedPurchases = response.data.purchases.map((p) => ({
          ...p,
          purchase_date: new Date(
            new Date(p.purchase_date).getTime() + 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        }));
        setPurchases(formattedPurchases);
      })
      .catch((err) => {
        console.error("Failed to fetch purchases:", err);
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
        Manage Purchases
      </Typography>
      <PurchaseForm onPurchaseAdded={fetchPurchases} />
      <Box sx={{ marginTop: "30px" }}>
        <DataTable
          data={purchases}
          onUpdate={fetchPurchases}
          onDelete={fetchPurchases}
        />
      </Box>
    </Box>
  );
};

export default Purchases;
