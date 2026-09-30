import api from './api';
import { getToken } from '../utils/storage';

// Helper to get auth headers
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -----------------------------------------------
// Start Interview
// -----------------------------------------------

export const startInterview = async (data: {
  type: string;
  role: string;
  useResume?: boolean;
  resume?: any;
}) => {
  try {
    const response = await api.post('/interview/start', data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('startInterview error:', error);
    return null;
  }
};

// -----------------------------------------------
// Submit Answer
// -----------------------------------------------

export const submitAnswer = async (data: {
  interviewId: string;
  answer: string;
}) => {
  try {
    const response = await api.post('/interview/answer', data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('submitAnswer error:', error);
    return null;
  }
};

// -----------------------------------------------
// Get Single Interview
// -----------------------------------------------

export const getInterview = async (id: string) => {
  try {
    const response = await api.get(`/interview/${id}`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('getInterview error:', error);
    return null;
  }
};

// -----------------------------------------------
// Get All Interviews
// -----------------------------------------------

export const getAllInterviews = async () => {
  try {
    const response = await api.get('/interview/all', {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('getAllInterviews error:', error);
    return null;
  }
};
