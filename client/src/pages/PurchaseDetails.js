import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getPurchases,
  deletePurchaseDetail,
  updatePurchaseDetail,
} from "../services/api";
import PurchaseItemsTable from "../components/PurchaseItemsTable";
import "../styles/App.css";

const PurchaseDetails = () => {
  const { purchase_id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState("");
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const fetchPurchase = () => {
    getPurchases()
      .then((response) => {
        const purchases = response.data.purchases.map((p) => ({
          ...p,
          purchase_date: new Date(
            new Date(p.purchase_date).getTime() + 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        }));
        const selectedPurchase = purchases.find(
          (p) => p.purchase_id === parseInt(purchase_id)
        );
        if (selectedPurchase) {
          setPurchase(selectedPurchase);
        } else {
          setError("Purchase not found");
        }
      })
      .catch((err) => {
        setError("Failed to fetch purchase details: " + err.message);
      });
  };

  useEffect(() => {
    fetchPurchase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchase_id]);

  const handleDeleteItem = (detail_id) => {
    deletePurchaseDetail(detail_id)
      .then(() => {
        fetchPurchase();
      })
      .catch((err) => {
        setError("Failed to delete item: " + err.message);
      });
  };

  const handleEditItem = (detail_id, quantity) => {
    if (detail_id && typeof quantity !== "undefined") {
      setEditingDetailId(detail_id);
      setEditQuantity(String(quantity));
    } else {
      setError("Invalid item data");
    }
  };

  const handleUpdateQuantity = (quantity) => {
    setEditQuantity(quantity);
  };

  const handleSaveEdit = (detail_id) => {
    const parsedQuantity = parseInt(editQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    updatePurchaseDetail(detail_id, {
      quantity: parsedQuantity,
    })
      .then(() => {
        setEditingDetailId(null);
        setEditQuantity("");
        fetchPurchase();
      })
      .catch((err) => {
        setError("Failed to update item: " + err.message);
      });
  };

  const handleCancelEdit = () => {
    setEditingDetailId(null);
    setEditQuantity("");
  };

  if (error) {
    return (
      <Box className="app-container" sx={{ mt: "100px", p: "30px" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!purchase) {
    return (
      <Box className="app-container" sx={{ mt: "100px", p: "30px" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

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
        Purchase Details
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: "#34495e" }}>
          Customer Name: {purchase.customer_name}
        </Typography>
        <Typography variant="h6" sx={{ color: "#34495e" }}>
          Purchase Date: {purchase.purchase_date}
        </Typography>
        <Typography variant="h6" sx={{ color: "#34495e" }}>
          Total Amount: ₹{purchase.total_amount}
        </Typography>
      </Box>
      <PurchaseItemsTable
        items={purchase.items}
        editingDetailId={editingDetailId}
        editQuantity={editQuantity}
        onEdit={handleEditItem}
        onUpdateQuantity={handleUpdateQuantity}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteItem}
      />
    </Box>
  );
};

export default PurchaseDetails;
