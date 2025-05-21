import axios from "axios";
import { JobPayload } from "./types";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/jobs`;

export const fetchJobs = (params: any) => axios.get(API_URL, { params });
export const createJob = (data: JobPayload) => axios.post(API_URL, data);
export const updateJob = (id: string, data: JobPayload) => axios.put(`${API_URL}/${id}`, data);
export const deleteJob = (id: string) => axios.delete(`${API_URL}/${id}`);
export const fetchJobById = (id: string) => axios.get(`${API_URL}/${id}`);
