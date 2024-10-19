import React, { createContext, useState, useContext } from "react";

// Create the userContext
const userContext = createContext();

// Define the AuthContext component
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <userContext.Provider value={{ user, login, logout }}>
      {children}
    </userContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(userContext);

export default AuthContextProvider;
