
// Product structure as plain JS object (for TypeScript, use interfaces/types)
export const defaultIpadProduct = {
  name: "",
  basePrice: "",
  sku: "",
  accessories: "iphone",
  storageConfigs: [],
  colorImageConfigs: [],
  simConfigs: [],
  dynamicRegions: [],
  details: [],
  productlinkname: "",
  preOrderConfig: {
    isPreOrder: false,
    availabilityDate: "",
    estimatedShipping: "",
    preOrderDiscount: 0,
    maxPreOrderQuantity: 0,
  },
};

// Slug generator utility
export function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Example CRUD functions using axios (adjust endpoints as needed)
import axios from "axios";
const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchIpadProducts() {
  const res = await api.get("/ipadproducts");
  return res.data;
}

export async function fetchIpadProductById(id) {
  const res = await api.get(`/ipadproducts/${id}`);
  return res.data;
}

export async function createIpadProduct(product) {
  const res = await api.post("/ipadproducts", product);
  return res.data;
}

export async function updateIpadProduct(id, product) {
  const res = await api.put(`/ipadproducts/${id}`, product);
  return res.data;
}

export async function deleteIpadProduct(id) {
  const res = await api.delete(`/ipadproducts/${id}`);
  return res.data;
}