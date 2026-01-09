import axios from 'axios';
import type { Project, Message, ChatMessage } from '@/types';

// Use external backend URL if provided, otherwise use Next.js API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
  },
  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },
};

// Contact API
export const contactApi = {
  sendMessage: async (data: Omit<Message, 'id' | 'createdAt'>): Promise<Message> => {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },
};

// AI Chat API
export const aiApi = {
  chat: async (params: {
    message: string;
    history?: ChatMessage[];
    mode?: 'developer' | 'designer' | 'mentor' | 'career';
    sessionId?: string;
    userName?: string;
    agentMode?: boolean;
  }): Promise<{ response: string; sessionId?: string }> => {
    const response = await apiClient.post<{ response: string; sessionId?: string }>('/ai/chat', params);
    return response.data;
  },
  resumeReview: async (payload: {
    file?: File;
    text?: string;
    role?: string;
    userName?: string;
  }): Promise<{ feedback: string }> => {
    const form = new FormData();
    if (payload.file) form.append('file', payload.file);
    if (payload.text) form.append('text', payload.text);
    if (payload.role) form.append('role', payload.role);
    if (payload.userName) form.append('userName', payload.userName);

    const response = await apiClient.post<{ feedback: string }>('/ai/resume-review', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

