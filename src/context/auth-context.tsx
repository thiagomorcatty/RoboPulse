"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: any | null;
  activeTenant: any | null;
  setActiveTenant: (tenant: any) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  activeTenant: null,
  setActiveTenant: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [activeTenant, setActiveTenant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const res = await fetch("/api/auth/me");
          if (res.ok) {
            const data = await res.json();
            setDbUser(data);
            
            // Auto-selecionar o primeiro perfil se houver
            if (data.tenants && data.tenants.length > 0) {
              setActiveTenant(data.tenants[0].tenant);
            }
          }
        } catch (err) {
          console.error("Erro ao carregar perfil do banco:", err);
        }
      } else {
        setDbUser(null);
        setActiveTenant(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, activeTenant, setActiveTenant, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
