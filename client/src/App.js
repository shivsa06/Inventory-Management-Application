import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Items from "./pages/Items";
import PurchaseDetails from "./pages/PurchaseDetails";

const App = () => {
  return (
    <BrowserRouter>
      <AppBar position="fixed" sx={{ backgroundColor: "#2c3e50" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600 }}
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "white" }}
          >
            Store App
          </Typography>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Home
            </Link>
            <Link
              to="/items"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Items
            </Link>
            <Link
              to="/inventory"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Inventory
            </Link>
            <Link
              to="/purchases"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Purchases
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingTop: "100px", paddingBottom: "40px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/purchases/:purchase_id" element={<PurchaseDetails />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
