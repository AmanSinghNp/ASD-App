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
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if there's a JWT token in localStorage or elsewhere (for example, via cookies)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // If there's a token, you can decode it or fetch the user's data from an API
      // For this example, we assume you have a `getUserFromToken` function that fetches the user details based on the token
      fetchUserFromToken(storedToken);
    }
  }, []);

  const fetchUserFromToken = async (token: string) => {
    try {
      // For example, decode the token to get the user's information (if you don't want to decode it manually, use a library like `jwt-decode`)
      const response = await fetch('http://localhost:4000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = (user: User) => {
    setUser(user);
    // Store the token in localStorage (or cookies)
    localStorage.setItem('token', 'your-jwt-token');  // Store actual JWT token here
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove token on logout
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
