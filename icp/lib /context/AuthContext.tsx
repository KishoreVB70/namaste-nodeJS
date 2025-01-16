"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

interface AuthContextType {
  isAuthLoading: boolean;
  principal: Principal | null;
  isAuthenticated: boolean;
  userActor: HttpAgent | null;
  setIsAuthLoading: Dispatch<SetStateAction<boolean>>;
  setPrincipal: Dispatch<SetStateAction<Principal | null>>;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setUserActor: Dispatch<SetStateAction<HttpAgent | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userActor, setUserActor] = useState<HttpAgent| null>(null);

  return (
    <AuthContext.Provider value={{
      principal,
      setPrincipal,
      isAuthenticated,
      setIsAuthenticated,
      isAuthLoading,
      setIsAuthLoading,
      userActor,
      setUserActor
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