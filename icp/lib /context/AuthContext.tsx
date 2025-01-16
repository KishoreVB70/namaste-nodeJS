"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { Principal } from '@dfinity/principal';

interface AuthContextType {
  isAuthLoading: boolean;
  principal: Principal | null;
  isAuthenticated: boolean;
  setIsAuthLoading: Dispatch<SetStateAction<boolean>>;
  setPrincipal: Dispatch<SetStateAction<Principal | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  return (
    <AuthContext.Provider value={{
      principal,
      setPrincipal,
      isAuthenticated,
      setIsAuthenticated,
      isAuthLoading,
      setIsAuthLoading,
    }}>
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