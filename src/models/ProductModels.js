
// Product structure as plain JS object (for TypeScript, use interfaces/types)
export const defaultProduct = {
  name: "",
  sku: Date.now().toString(),
  basePrice: "",
  storageConfigs: [],
  colorImageConfigs: [],
  dynamicRegions: [],
  details: [],
  preOrderConfig: {
    isPreOrder: false,
    availabilityDate: "",
    estimatedShipping: "",
    preOrderDiscount: 0,
    maxPreOrderQuantity: 0,
  },
  accessories: "iphone",
};

// Example CRUD functions using axios (adjust endpoints as needed)
import axios from "axios";
const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(product) {
  const res = await api.post("/products", product);
  return res.data;
}

export async function updateProduct(id, product) {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}
