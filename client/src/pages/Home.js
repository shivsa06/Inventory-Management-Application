import React from "react";
import { Box, Typography } from "@mui/material";
import "../styles/App.css";

const Home = () => {
  return (
    <Box
      className="app-container"
      sx={{
        marginTop: "100px",
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f9f9f9",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h2"
        className="header"
        sx={{ fontWeight: 700, color: "#2c3e50" }}
      >
        Welcome to Store App
      </Typography>
      <Typography
        variant="body1"
        sx={{ marginTop: "10px", fontSize: "18px", color: "#555" }}
      >
        Manage your store's items, inventory, and purchases efficiently.
      </Typography>
    </Box>
  );
};

export default Home;
