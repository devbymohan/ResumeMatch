import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  
  useEffect(() => { 
    if (!user) nav("/login", { replace: true }); 
  }, [user, nav]);
  
  if (!user) return null;
  return <>{children}</>;
}
