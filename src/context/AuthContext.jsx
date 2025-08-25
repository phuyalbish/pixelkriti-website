import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const isAuthenticated = !!accessToken;
  const isStaff = user?.is_staff;
  const isSuperuser = user?.is_superuser;

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken && !user) {
        try {
          const res = await axios.get("/get_login_user_detail", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          localStorage.removeItem("accessToken");
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [accessToken, user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, isStaff, isSuperuser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};