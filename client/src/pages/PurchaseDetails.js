import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import PurchaseItemsTable from "../components/PurchaseItemsTable";
import "../styles/App.css";

const PurchaseDetails = () => {
  const { purchase_id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState("");
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const fetchPurchase = () => {
    axios
      .get("http://localhost:1111/purchases/getPurchase")
      .then((response) => {
        const purchases = response.data.purchases;
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
    axios
      .delete(`http://localhost:1111/purchases/details/${detail_id}`)
      .then(() => {
        fetchPurchase();
      })
      .catch((err) => {
        setError("Failed to delete item: " + err.message);
      });
  };

  const handleEditItem = (item) => {
    if (item?.detail_id && Number.isFinite(item?.quantity)) {
      setEditingDetailId(item.detail_id);
      setEditQuantity(String(item.quantity));
      setError("");
    } else {
      setError("Invalid item data");
      console.error("Invalid item:", item);
    }
  };

  const handleSaveEdit = (detail_id) => {
    const parsedQuantity = parseInt(editQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    axios
      .get(`http://localhost:1111/inventory/getInventory`)
      .then((response) => {
        const inventory = response.data.inventory;
        const itemDetail = purchase.items.find(
          (item) => item.detail_id === detail_id
        );
        if (!itemDetail) {
          setError("Item detail not found");
          return;
        }
        const currentStock =
          inventory.find((inv) => inv.item_id === itemDetail.item_id)
            ?.quantity || 0;
        const oldQuantity = itemDetail.quantity;
        const quantityChange = parsedQuantity - oldQuantity;

        if (quantityChange > currentStock) {
          Swal.fire({
            icon: "error",
            title: "Insufficient Stock",
            text: `Requested quantity (${parsedQuantity}) exceeds available stock (${currentStock}).`,
          });
          return;
        }

        axios
          .put(`http://localhost:1111/purchases/details/${detail_id}`, {
            quantity: parsedQuantity,
          })
          .then(() => {
            setEditingDetailId(null);
            setEditQuantity("");
            setError("");
            fetchPurchase();
          })
          .catch((err) => {
            setError("Failed to update item: " + err.message);
          });
      })
      .catch((err) => {
        setError("Failed to fetch inventory: " + err.message);
      });
  };

  const handleCancelEdit = () => {
    setEditingDetailId(null);
    setEditQuantity("");
    setError("");
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
        items={purchase.items || []}
        editingDetailId={editingDetailId}
        editQuantity={editQuantity}
        onEdit={handleEditItem}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteItem}
        setEditQuantity={setEditQuantity}
      />
    </Box>
  );
};

export default PurchaseDetails;
