import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const activeSession = data?.session ?? null;
        setSession(activeSession);

        if (activeSession?.user) {
          await fetchUserProfile(activeSession.user.id);
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await fetchUserProfile(newSession.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch extra user info from app_users
  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from("app_users")
        .select("*")
        .eq("id", uid)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Sign in using Supabase Auth
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);
      await fetchUserProfile(data.user.id);
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthCtx);
