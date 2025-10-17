"use client"
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    checkAuthStatus();
  }, []);


  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };


 return (
   <AuthContext.Provider
     value={{
       user,
       isLoggedIn,
       setUser,
       setIsLoggedIn,
       checkAuthStatus,
     }}
   >
     {children}
   </AuthContext.Provider>
 );
};
