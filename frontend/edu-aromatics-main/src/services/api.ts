
import axios from 'axios';
import { TeacherDTO, ClassroomDTO, ARExperienceDTO, LoginResponse, ApiError } from '../types/api';
import { toast } from '@/components/ui/use-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ar4learn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status
    } as ApiError);
  }
);

// Auth APIs
export const authApi = {
  register: (teacher: TeacherDTO) => 
    api.post<TeacherDTO>('/teachers', teacher).then(res => res.data),
  
  login: (credentials: { email: string; password: string }) => {
    // According to the backend endpoint, we should send email and password
    const loginData: TeacherDTO = {
      email: credentials.email,
      password: credentials.password,
      username: '' // This field is required by the TeacherDTO interface but not used for login
    };
    console.log('Login request payload:', loginData);
    return api.post<LoginResponse>('/teachers/login', loginData)
      .then(res => {
        console.log('Login response:', res.data);
        return res.data;
      })
      .catch(error => {
        console.error('Login error details:', error);
        throw error;
      });
  },
  
  getTeacherProfile: (teacherId: number) => 
    api.get<TeacherDTO>(`/teachers/${teacherId}`).then(res => res.data),
  
  updateTeacherProfile: (teacherId: number, teacher: TeacherDTO) => 
    api.put<TeacherDTO>(`/teachers/${teacherId}`, teacher).then(res => res.data),
};

// Classroom APIs
export const classroomApi = {
  createClassroom: (teacherId: number, classroom: ClassroomDTO) => {
    console.log(`Creating classroom for teacher ${teacherId}:`, classroom);
    return api.post<ClassroomDTO>(`/teachers/${teacherId}`, classroom)
      .then(res => {
        console.log('Classroom creation response:', res.data);
        return res.data;
      })
      .catch(error => {
        console.error('Classroom creation error:', error);
        throw error;
      });
  },
  
  getClassrooms: (teacherId: number) => 
    api.get<ClassroomDTO[]>(`/teachers/${teacherId}/classrooms`).then(res => res.data),
};

// AR Experience APIs
export const arExperienceApi = {
  createARExperience: (teacherId: number, classroomId: number, experience: ARExperienceDTO) => 
    api.post<ARExperienceDTO>(`/teachers/${teacherId}/classrooms/${classroomId}`, experience)
      .then(res => res.data),
  
  updateARExperience: (classroomId: number, experienceId: number, experience: ARExperienceDTO) => 
    api.put<ARExperienceDTO>(`/${classroomId}/experiences/${experienceId}`, experience)
      .then(res => res.data),
};

export default api;
