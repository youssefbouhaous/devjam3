
export interface TeacherDTO {
  teacherID?: number;
  name?: string;
  username: string; // Required field
  password: string; // Required field
  email?: string;
}

export interface ClassroomDTO {
  classroomID?: number;
  name: string;
  description?: string;
}

export interface ARExperienceDTO {
  experienceID?: number;
  name: string;
  description?: string;
  file?: string;
}

export interface LoginResponse {
  teacherID: number;
  name: string;
  username: string;
  email: string;
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
