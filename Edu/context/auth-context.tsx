import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  email: string;
  progress?: Record<string, number>;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProgress: (courseId: string, progress: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("@user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // In a real app, you would call your API
      // This is just a mock implementation
      const mockUser: User = {
        id: "123",
        name: "Test User",
        email,
        progress: {
          "1": 0.25, // Botany course
          "3": 0.6, // Marine Biology course
        },
      };

      await AsyncStorage.setItem("@user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Sign in failed", error);
      throw new Error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      // In a real app, you would call your API
      // This is just a mock implementation
      const mockUser: User = {
        id: "123",
        name,
        email,
        progress: {},
      };

      await AsyncStorage.setItem("@user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Sign up failed", error);
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProgress = async (courseId: string, progress: number) => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          [courseId]: progress,
        },
      };

      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, updateUserProgress }}
    >
      {children}
    </AuthContext.Provider>
  );
};
