import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Paper,
  TextField,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  updateItem,
  deleteItem,
  updateInventory,
  deleteInventory,
  deletePurchase,
} from "../services/api";
import "../styles/Table.css";

const DataTable = ({ data, onUpdate, onDelete }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const isInventoryTable = data.some((item) => item.inventory_id);
  const isPurchaseTable = data.some((item) => item.purchase_id);
  const tableType = isPurchaseTable
    ? "purchase"
    : isInventoryTable
    ? "inventory"
    : "item";

  const columnsConfig = {
    item: [
      { key: "name", label: "Name", editable: true },
      { key: "price", label: "Price", editable: true, type: "number" },
      { key: "type_name", label: "Type Name", editable: true },
    ],
    inventory: [
      { key: "name", label: "Name", editable: true },
      { key: "price", label: "Price", editable: true, type: "number" },
      { key: "type_name", label: "Type Name", editable: true },
      { key: "quantity", label: "Quantity", editable: true, type: "number" },
    ],
    purchase: [
      { key: "customer_name", label: "Customer Name", editable: false },
      { key: "purchase_date", label: "Purchase Date", editable: false },
      { key: "total_amount", label: "Total Amount", editable: false },
    ],
  };

  const typeConfig = {
    item: {
      endpoint: (id) =>
        updateItem(id, {
          name: editData.name,
          price: parseFloat(editData.price) || 0,
          type_id: editData.type_id,
        }),
      deleteEndpoint: (id) => deleteItem(id),
      idKey: "item_id",
    },
    inventory: {
      endpoint: (id) =>
        updateInventory(id, {
          quantity: parseInt(editData.quantity) || 0,
          item_id: editData.item_id,
        }),
      deleteEndpoint: (id) => deleteInventory(id),
      idKey: "inventory_id",
    },
    purchase: {
      deleteEndpoint: (id) => deletePurchase(id),
      idKey: "purchase_id",
    },
  };

  const handleEdit = (item) => {
    if (tableType !== "purchase") {
      setEditId(item[typeConfig[tableType].idKey]);
      setEditData(item);
    }
  };

  const handleSave = (id) => {
    if (tableType !== "purchase") {
      const config = typeConfig[tableType];
      config
        .endpoint(id)
        .then(() => {
          setEditId(null);
          if (onUpdate) onUpdate();
        })
        .catch((err) => {
          console.error("Failed to update:", err);
        });
    }
  };

  const handleDelete = (id) => {
    const config = typeConfig[tableType];
    config
      .deleteEndpoint(id)
      .then(() => {
        if (onDelete) onDelete();
      })
      .catch((err) => {
        console.error("Failed to delete:", err);
      });
  };

  const renderCell = (item, column) => {
    if (
      tableType !== "purchase" &&
      editId === item[typeConfig[tableType].idKey] &&
      column.editable
    ) {
      return (
        <TextField
          type={column.type || "text"}
          value={editData[column.key] || ""}
          onChange={(e) =>
            setEditData({
              ...editData,
              [column.key]:
                column.type === "number"
                  ? parseFloat(e.target.value) || ""
                  : e.target.value,
            })
          }
          size="small"
          sx={{ width: "100%" }}
        />
      );
    }
    return column.key === "total_amount"
      ? `₹${item[column.key] || "-"}`
      : item[column.key] || "-";
  };

  return (
    <Box className="table-container" sx={{ mt: 3 }}>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table sx={{ minWidth: 650, "& th, & td": { padding: "12px 16px" } }}>
          <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
            <TableRow>
              {columnsConfig[tableType].map((column) => (
                <TableCell
                  key={column.key}
                  sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "left" }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "center" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={`${item[typeConfig[tableType].idKey]}-${index}`}
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#fafbfc" },
                  "&:hover": { backgroundColor: "#f1f3f5" },
                }}
              >
                {columnsConfig[tableType].map((column) => (
                  <TableCell key={column.key} sx={{ textAlign: "left" }}>
                    {renderCell(item, column)}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: "center" }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    {tableType !== "purchase" &&
                    editId === item[typeConfig[tableType].idKey] ? (
                      <IconButton
                        onClick={() =>
                          handleSave(item[typeConfig[tableType].idKey])
                        }
                        sx={{ color: "#1976d2" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      tableType !== "purchase" && (
                        <IconButton
                          onClick={() => handleEdit(item)}
                          sx={{ color: "#1976d2" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )
                    )}
                    <IconButton
                      onClick={() =>
                        handleDelete(item[typeConfig[tableType].idKey])
                      }
                      sx={{ color: "#d32f2f" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    {tableType === "purchase" && (
                      <IconButton
                        onClick={() =>
                          navigate(`/purchases/${item.purchase_id}`)
                        }
                        sx={{ color: "#1976d2" }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DataTable;
