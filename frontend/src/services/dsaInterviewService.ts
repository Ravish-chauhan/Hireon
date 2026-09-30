import api from './api';
import { getToken } from '../utils/storage';
import type {
  StartDSAInterviewRequest,
  StartDSAInterviewResponse,
  SendDSAMessageRequest,
  SendDSAMessageResponse,
  GetDSAInterviewResponse,
  SaveDSACodeRequest,
  SaveDSACodeResponse,
  ExecuteDSACodeRequest,
  ExecuteDSACodeResponse,
  GetDSAExecutionResponse,
} from '../types/dsaInterview';

// Helper to get auth headers (same pattern as interviewService)
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -----------------------------------------------
// Start DSA Interview
// -----------------------------------------------

export const startDSAInterview = async (
  data: StartDSAInterviewRequest
): Promise<StartDSAInterviewResponse | null> => {
  try {
    const response = await api.post('/dsa-interview/start', data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('startDSAInterview error:', error);
    return null;
  }
};

// -----------------------------------------------
// Get DSA Interview
// -----------------------------------------------

export const getDSAInterview = async (
  id: string
): Promise<GetDSAInterviewResponse | null> => {
  try {
    const response = await api.get(`/dsa-interview/${id}`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('getDSAInterview error:', error);
    return null;
  }
};

// -----------------------------------------------
// Send Message in DSA Interview
// -----------------------------------------------

export const sendDSAMessage = async (
  interviewId: string,
  data: SendDSAMessageRequest
): Promise<SendDSAMessageResponse | null> => {
  try {
    const response = await api.post(`/dsa-interview/${interviewId}/message`, data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('sendDSAMessage error:', error);
    return null;
  }
};

// -----------------------------------------------
// Save / Autosave Candidate Code
// -----------------------------------------------

export const saveDSACode = async (
  interviewId: string,
  data: SaveDSACodeRequest
): Promise<SaveDSACodeResponse | null> => {
  try {
    const response = await api.patch(`/dsa-interview/${interviewId}/code`, data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('saveDSACode error:', error);
    return null;
  }
};

// -----------------------------------------------
// Request Code Execution (Run / Submit Event)
// -----------------------------------------------

export const executeDSACode = async (
  interviewId: string,
  data: ExecuteDSACodeRequest
): Promise<ExecuteDSACodeResponse | null> => {
  try {
    const response = await api.post(`/dsa-interview/${interviewId}/execute`, data, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('executeDSACode error:', error);
    return null;
  }
};

// -----------------------------------------------
// Get Execution Status & Results
// -----------------------------------------------

export const getDSAExecutionStatus = async (
  interviewId: string,
  executionId: string
): Promise<GetDSAExecutionResponse | null> => {
  try {
    const response = await api.get(
      `/dsa-interview/${interviewId}/execution/${executionId}`,
      {
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('getDSAExecutionStatus error:', error);
    return null;
  }
};


