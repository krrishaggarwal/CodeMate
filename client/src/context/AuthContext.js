import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem('user');
      return null;
    }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isValidating, setIsValidating] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Validate user with backend
  const validateUser = useCallback(async (currentUser) => {
    if (!currentUser?.userId || isValidating) return;

    setIsValidating(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`/api/user/${currentUser.userId}`, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Session validation failed");

      const userData = await res.json();
      if (userData && userData.userId === currentUser.userId) {
        if (JSON.stringify(userData) !== JSON.stringify(currentUser)) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn("User validation failed. Logging out...", error.message);
        logout();
      }
    } finally {
      setIsValidating(false);
    }
  }, [isValidating]);

  useEffect(() => {
    if (isInitialMount && user?.userId && !isValidating) {
      const validationTimer = setTimeout(() => validateUser(user), 2000);
      return () => clearTimeout(validationTimer);
    }
    setIsInitialMount(false);
  }, [user, isValidating, isInitialMount, validateUser]);

  // Theme handling
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const login = useCallback((data) => {
    if (!data?.user || !data.user._id) {
      console.error("Invalid user data provided to login");
      return;
    }

    const userData = {
      userId: data.user._id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatar || null,
      bio: data.user.bio || '',
      skills: data.user.skills || [],
      token: data.token || null
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsValidating(false);
    setIsInitialMount(false);
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    setIsValidating(false);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    if (!updatedUser?.userId) {
      console.error("Invalid user data provided to updateUser");
      return;
    }

    setUser(prev => {
      const mergedUser = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      return mergedUser;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        theme,
        isValidating,
        login,
        logout,
        updateUser,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};