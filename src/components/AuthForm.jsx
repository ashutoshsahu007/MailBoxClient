import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const AuthForm = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Login, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let url = "";

    if (Login) {
      if (!email || !password) {
        alert("please fill the all fields");
        return;
      }
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A";
    } else {
      if (!email || !password || !confirmPassword) {
        alert("please fill the all fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("passwords do not match!");
        return;
      }
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A";
    }

    fetch(url, {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) throw new Error(data.error.message);
          return data;
        });
      })
      .then((data) => {
        !Login && alert("SignUp Successful");
        Login && authCtx.login(data.idToken, data.email);
        Login && navigate("/compose");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      {/* Mobile Dropdown */}

      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden bg-white shadow-lg px-6 py-4 space-y-2 text-gray-700 font-medium">
          <div className="hover:text-blue-600 cursor-pointer">Home</div>
          <div className="hover:text-blue-600 cursor-pointer">Products</div>
          <div className="hover:text-blue-600 cursor-pointer">About Us</div>
        </div>
      )}

      {/* Card */}
      <div className="relative bg-white shadow-xl border rounded-2xl w-full max-w-md p-8 sm:p-10">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          {Login ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>

        <form className="space-y-5" onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!Login && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer"
          >
            {Login ? "Log In" : "Sign Up"}
          </button>

          {Login && (
            <p className="text-sm text-blue-600 hover:underline cursor-pointer text-center">
              Forgot password?
            </p>
          )}
        </form>

        {/* Login / Signup toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin((prev) => !prev)}
            className="w-full border rounded-lg py-3 bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-700 cursor-pointer"
          >
            {Login
              ? "Don’t have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
