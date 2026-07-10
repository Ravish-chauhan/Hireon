import api from "./api";

export const uploadResume = async (formData: FormData) => {
  return await api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const analyzeResume = async (resumeId: string, jd?: string, jobRole?: string) => {
  return await api.post(`/resumes/analyze/${resumeId}`, { 
    jobDescription: jd || "", 
    jobRole: jobRole || "" 
  });
};

export const rewriteResume = async (analysisId: string) => {
  return await api.post(`/resumes/rewrite/${analysisId}`);
};