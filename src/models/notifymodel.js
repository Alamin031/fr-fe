
// Notify structure as plain JS object
export const defaultNotify = {
    name: "",
    email: "",
    phone: "",
    product: "",
    productId: "",
    selectedOptions: {},
    totalPrice: 0,
    timestamp: null,
};

// Example CRUD functions using axios (adjust endpoints as needed)
import axios from "axios";
const api = axios.create({
    baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

export async function fetchNotifies() {
    const res = await api.get("/notify");
    return res.data;
}

export async function fetchNotifyById(id) {
    const res = await api.get(`/notify/${id}`);
    return res.data;
}

export async function createNotify(notify) {
    const res = await api.post("/notify", notify);
    return res.data;
}

export async function updateNotify(id, notify) {
    const res = await api.put(`/notify/${id}`, notify);
    return res.data;
}

export async function deleteNotify(id) {
    const res = await api.delete(`/notify/${id}`);
    return res.data;
}