import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeacherDTO, LoginResponse } from '@/types/api';
import { authApi } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: Omit<TeacherDTO, 'password'> & { teacherID: number } | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: TeacherDTO) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<TeacherDTO>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(Omit<TeacherDTO, 'password'> & { teacherID: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('ar4learn_token');
        const teacherId = localStorage.getItem('ar4learn_teacher_id');
        
        if (token && teacherId) {
          const profile = await authApi.getTeacherProfile(Number(teacherId));
          if (profile) {
            setUser({ 
              teacherID: Number(teacherId),
              name: profile.name,
              username: profile.username,
              email: profile.email
            });
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('ar4learn_token');
        localStorage.removeItem('ar4learn_teacher_id');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email });
      const response = await authApi.login({ email, password });
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      console.log('Login successful, setting user data:', response);
      
      if (response.token) {
        localStorage.setItem('ar4learn_token', response.token);
      }
      
      if (response.teacherID) {
        localStorage.setItem('ar4learn_teacher_id', String(response.teacherID));
      }
      
      setUser({
        teacherID: response.teacherID,
        name: response.name || '',
        username: response.username,
        email: response.email || ''
      });
      
      toast({
        title: 'Welcome back!',
        description: `You've successfully logged in.`,
      });
      
      navigate('/dashboard');
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: TeacherDTO) => {
    try {
      setLoading(true);
      await authApi.register(userData);
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. Please login.',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ar4learn_token');
    localStorage.removeItem('ar4learn_teacher_id');
    setUser(null);
    navigate('/login');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const updateProfile = async (data: Partial<TeacherDTO>) => {
    try {
      if (!user?.teacherID) throw new Error('User not authenticated');
      
      setLoading(true);
      const updatedProfile = await authApi.updateTeacherProfile(
        user.teacherID,
        { ...user, ...data, password: '' } as TeacherDTO
      );
      
      setUser({
        teacherID: user.teacherID,
        name: updatedProfile.name,
        username: updatedProfile.username,
        email: updatedProfile.email
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
