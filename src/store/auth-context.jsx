import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create Auth Context
const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export default AuthContext;

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load saved token and login time from localStorage
  const storedToken = localStorage.getItem("token");
  const storedLoginTime = localStorage.getItem("loginTime");

  // If the token is already expired before app loads
  if (storedLoginTime && Date.now() - storedLoginTime > 5 * 60 * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  }

  const [token, setToken] = useState(storedToken);
  const isLoggedIn = !!token;

  // Login Handler
  const loginHandler = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("loginTime", Date.now());
  };

  // Logout Handler
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
  };

  // Auto logout after 5 minutes
  useEffect(() => {
    if (token) {
      const loginTime = Number(localStorage.getItem("loginTime"));
      const remainingTime = 5 * 60 * 1000 - (Date.now() - loginTime);

      const timer = setTimeout(logoutHandler, remainingTime);
      return () => clearTimeout(timer); // cleanup
    }
  }, [token]);

  // Context value
  const contextValue = {
    token,
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
