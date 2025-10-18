import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for token in localStorage when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUserFromToken(storedToken);  // If there's a token, fetch user data
    }
  }, []);

  // Fetch user data based on the token
  const fetchUserFromToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      } else {
        // If token is invalid or expired, clear the token
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    }
  };

  // Login function: set the user and store the token
  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('token', token);  // Store the token in localStorage
  };

  // Logout function: clear the user and remove the token
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
