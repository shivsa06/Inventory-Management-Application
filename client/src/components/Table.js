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
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Table.css";

const DataTable = ({ data, onUpdate, onDelete, editableColumns = [] }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [itemTypes, setItemTypes] = useState([]);
  const navigate = useNavigate();

  const isInventoryTable = data.some((item) => item.inventory_id);
  const isPurchaseTable = data.some((item) => item.purchase_id);
  const tableType = isPurchaseTable
    ? "purchase"
    : isInventoryTable
    ? "inventory"
    : "item";

  React.useEffect(() => {
    if (tableType === "item") {
      axios
        .get("http://localhost:1111/items/getItemTypes")
        .then((response) => {
          setItemTypes(response.data.itemTypes || []);
        })
        .catch((err) => {
          console.error("Failed to fetch item types:", err);
        });
    }
  }, [tableType]);

  const columnsConfig = {
    item: [
      { key: "name", label: "Name", editable: true },
      { key: "price", label: "Price", editable: true, type: "number" },
      {
        key: "type_id",
        label: "Type Name",
        editable: true,
        type: "select",
        options: itemTypes,
        displayKey: "type_name",
      },
    ],
    inventory: [
      { key: "name", label: "Name", editable: false },
      { key: "price", label: "Price", editable: false, type: "number" },
      { key: "type_name", label: "Type Name", editable: false },
      { key: "quantity", label: "Quantity", editable: true, type: "number" },
    ],
    purchase: [
      { key: "customer_name", label: "Customer Name", editable: true },
      {
        key: "purchase_date",
        label: "Purchase Date",
        editable: true,
        type: "date",
      },
      { key: "total_amount", label: "Total Amount", editable: false },
    ],
  };

  const typeConfig = {
    item: {
      endpoint: (id) => `http://localhost:1111/items/${id}`,
      payload: (data) => ({
        name: data.name,
        price: parseFloat(data.price) || 0,
        type_id: parseInt(data.type_id) || data.type_id,
      }),
      idKey: "item_id",
    },
    inventory: {
      endpoint: (id) => `http://localhost:1111/inventory/${id}`,
      payload: (data) => ({
        quantity: parseInt(data.quantity) || 0,
        item_id: data.item_id,
      }),
      idKey: "inventory_id",
    },
    purchase: {
      endpoint: (id) => `http://localhost:1111/purchases/${id}`,
      payload: (data) => ({
        customer_name: data.customer_name,
        purchase_date: data.purchase_date,
        items: data.items.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      }),
      idKey: "purchase_id",
    },
  };

  const handleEdit = (item) => {
    setEditId(item[typeConfig[tableType].idKey]);
    setEditData(item);
  };

  const handleSave = (id) => {
    const config = typeConfig[tableType];
    axios
      .put(config.endpoint(id), config.payload(editData))
      .then(() => {
        setEditId(null);
        setEditData({});
        if (onUpdate) onUpdate();
      })
      .catch((err) => {
        console.error("Failed to update:", err);
      });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    const config = typeConfig[tableType];
    axios
      .delete(config.endpoint(id))
      .then(() => {
        if (onDelete) onDelete();
      })
      .catch((err) => {
        console.error("Failed to delete:", err);
      });
  };

  const renderCell = (item, column) => {
    if (
      editId === item[typeConfig[tableType].idKey] &&
      column.editable &&
      (!editableColumns.length || editableColumns.includes(column.key))
    ) {
      if (column.type === "select") {
        return (
          <TextField
            select
            value={editData[column.key] || ""}
            onChange={(e) =>
              setEditData({ ...editData, [column.key]: e.target.value })
            }
            size="small"
            sx={{ width: "100%" }}
          >
            {column.options.map((option) => (
              <MenuItem key={option.type_id} value={option.type_id}>
                {option[column.displayKey]}
              </MenuItem>
            ))}
          </TextField>
        );
      }
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
      : column.key === "type_id"
      ? item.type_name || "-"
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
                    {editId === item[typeConfig[tableType].idKey] ? (
                      <>
                        <IconButton
                          onClick={() =>
                            handleSave(item[typeConfig[tableType].idKey])
                          }
                          sx={{ color: "#1976d2" }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={handleCancel}
                          sx={{ color: "#d32f2f" }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() => handleEdit(item)}
                        sx={{ color: "#1976d2" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
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
