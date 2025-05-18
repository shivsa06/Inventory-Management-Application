import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1111",
});

export const createItem = (data) => api.post("/items/create", data);
export const getItems = () => api.get("/items/getItem");
export const getItemTypes = () => api.get("/items/getItemTypes");
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);

export const createInventory = (data) =>
  api.post("/inventory/createInventory", data);
export const getInventory = () => api.get("/inventory/getInventory");
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

export const createPurchase = (data) =>
  api.post("/purchases/createPurchase", data);
export const getPurchases = () => api.get("/purchases/getPurchase");
export const updatePurchase = (id, data) => api.put(`/purchases/${id}`, data);
export const deletePurchase = (id) => api.delete(`/purchases/${id}`);
export const deletePurchaseDetail = (id) =>
  api.delete(`/purchases/details/${id}`);
export const updatePurchaseDetail = (id, data) =>
  api.put(`/purchases/details/${id}`, data);
