import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create Auth Context
const AuthContext = createContext({
  token: "",
  email: "",
  isLoggedIn: false,
  login: (token, email) => {},
  logout: () => {},
});

export default AuthContext;

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load saved data from localStorage
  const storedToken = localStorage.getItem("token");
  const storedLoginTime = localStorage.getItem("loginTime");
  const storedEmail = localStorage.getItem("email");

  // Check token expiry
  if (storedLoginTime && Date.now() - storedLoginTime > 60 * 60 * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("email");
    navigate("/");
  }

  const [token, setToken] = useState(storedToken);
  const [email, setEmail] = useState(storedEmail || "");
  const isLoggedIn = !!token;

  // Login Handler
  const loginHandler = (newToken, userEmail) => {
    setToken(newToken);
    setEmail(userEmail);
    localStorage.setItem("token", newToken);
    localStorage.setItem("loginTime", Date.now());
    localStorage.setItem("email", userEmail);
  };

  // Logout Handler
  const logoutHandler = () => {
    setToken(null);
    setEmail("");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("email");
    navigate("/");
  };

  // Auto logout after 5 minutes
  useEffect(() => {
    if (token) {
      const loginTime = Number(localStorage.getItem("loginTime"));
      const remainingTime = 60 * 60 * 1000 - (Date.now() - loginTime);

      const timer = setTimeout(logoutHandler, remainingTime);
      return () => clearTimeout(timer); // cleanup
    }
  }, [token]);

  // Context value
  const contextValue = {
    token,
    email,
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
