import axios from "axios";
import { JobPayload } from "./types";

const API_URL = `${process.env.REACT_APP_API_URL}/jobs`;

export const fetchJobs = (params: any, config?: any) =>
  axios.get(API_URL, { params, ...config });
export const createJob = (data: JobPayload, token: string) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateJob = (id: string, data: JobPayload, config?: any) =>
  axios.put(`${API_URL}/${id}`, data, config);

export const deleteJob = (id: string, config?: any) =>
  axios.delete(`${API_URL}/${id}`, config);

export const deleteJobBulk = (url: string, data: { ids: string[] }, config?: any) => {
  return axios.post(url, data, config);
};

export const fetchJobById = (id: string, config?: any) =>
  axios.get(`${API_URL}/${id}`, config);
