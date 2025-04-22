import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
    const checkAuth = () => {
      const storedUser = Cookies.get('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.data) {
        // Lưu token và thông tin người dùng vào cookies
        Cookies.set('token', response.data.token, { 
          expires: 1, // 1 ngày
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        Cookies.set('user', JSON.stringify(response.data.user), { 
          expires: 1, // 1 ngày
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // Cập nhật state
        setUser(response.data.user);
        
        return { 
          success: true,
          user: response.data.user 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.data) {
        return { success: true, message: 'Đăng ký thành công!' };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
      };
    }
  };

  const logout = () => {
    // Xóa token và thông tin người dùng khỏi cookies
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Cập nhật state
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 