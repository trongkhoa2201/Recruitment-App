import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/joblogs`;

export const fetchJobLogsAPI = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
