import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import "../styles/Table.css";

const PurchaseItemsTable = ({
  items,
  editingDetailId,
  editQuantity,
  onEdit,
  onUpdateQuantity,
  onSave,
  onCancel,
  onDelete,
}) => {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ p: 2, backgroundColor: "#f5f7fa" }}>
        <Typography variant="h6" sx={{ color: "#2c3e50", fontWeight: 600 }}>
          Items Purchased
        </Typography>
      </Box>
      <Table sx={{ minWidth: 650, "& th, & td": { padding: "12px 16px" } }}>
        <TableHead sx={{ backgroundColor: "#f5f7fa" }}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "left" }}
            >
              Item Name
            </TableCell>
            <TableCell
              sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "left" }}
            >
              Quantity
            </TableCell>
            <TableCell
              sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "left" }}
            >
              Subtotal
            </TableCell>
            <TableCell
              sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "left" }}
            >
              Price
            </TableCell>
            <TableCell
              sx={{ fontWeight: 600, color: "#2c3e50", textAlign: "center" }}
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={`item-${item.detail_id}-${index}`}
              sx={{
                "&:nth-of-type(even)": { backgroundColor: "#fafbfc" },
                "&:hover": { backgroundColor: "#f1f3f5" },
              }}
            >
              <TableCell sx={{ textAlign: "left" }}>{item.item_name}</TableCell>
              <TableCell sx={{ textAlign: "left" }}>
                {editingDetailId === item.detail_id ? (
                  <TextField
                    type="number"
                    value={editQuantity}
                    onChange={(e) => onUpdateQuantity(e.target.value)}
                    size="small"
                    sx={{ width: "100px" }}
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
              <TableCell sx={{ textAlign: "left" }}>₹{item.subtotal}</TableCell>
              <TableCell sx={{ textAlign: "left" }}>₹{item.price}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  {editingDetailId === item.detail_id ? (
                    <>
                      <IconButton
                        onClick={() => onSave(item.detail_id)}
                        sx={{ color: "#1976d2" }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={onCancel} sx={{ color: "#d32f2f" }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      onClick={() => onEdit(item.detail_id, item.quantity)}
                      sx={{ color: "#1976d2" }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => onDelete(item.detail_id)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default PurchaseItemsTable;
