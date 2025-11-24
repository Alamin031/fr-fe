
// User structure as plain JS object
export const defaultUser = {
  image: "",
  username: "",
  email: "",
  password: "",
  id: "",
  role: "user",
  isVerified: false,
  isAdmin: false,
  forgotPasswordToken: "",
  forgetPasswordTokenExpire: null,
  verifyToken: "",
};

// Example CRUD functions using axios (adjust endpoints as needed)
import axios from "axios";
const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function fetchUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

export async function createUser(user) {
  const res = await api.post("/users", user);
  return res.data;
}

export async function updateUser(id, user) {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
