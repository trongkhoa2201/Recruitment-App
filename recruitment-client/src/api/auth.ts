import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = (data: { email: string; password: string; name: string }) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, data);
};
