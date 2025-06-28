// src/services/caseService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cases';

export const fetchCases = async (searchTerm = '') => {
  const response = await axios.get(`${API_URL}${searchTerm ? `?search=${searchTerm}` : ''}`);
  return response.data.cases;
};

export const createCase = async (caseData) => {
  const response = await axios.post(API_URL, caseData);
  return response.data.case;
};

export const getCaseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.case;
};

export const updateCase = async (id, updateData) => {
  const response = await axios.put(`${API_URL}/${id}`, updateData);
  return response.data.case;
};

export const deleteCase = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};