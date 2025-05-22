import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const registerUser = (data: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}/login`, data);

  const { token, user } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return res.data;
};
