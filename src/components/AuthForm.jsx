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
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.error.message);
          }
          return data;
        });
      })
      .then((data) => {
        authCtx.login(data.idToken);
        isLogg && navigate("/mail");
        !Login && alert("SignUp Successfull");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="mt-10 flex flex-col">
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 text-gray-700 font-medium">
          <div className="hover:text-blue-600 cursor-pointer">Home</div>
          <div className="hover:text-blue-600 cursor-pointer">Products</div>
          <div className="hover:text-blue-600 cursor-pointer">About Us</div>
        </div>
      )}

      <div className="relative flex flex-1 justify-center items-center px-4 sm:px-6">
        {/* Signup Card */}
        <div className="relative bg-white shadow-md border rounded-md w-full max-w-md p-6 sm:p-8 z-10">
          <h2 className="text-center text-2xl font-semibold mb-6">
            {Login ? "Log In" : "Sign Up"}
          </h2>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!Login && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
            >
              {Login ? "Log In" : "Sign up"}
            </button>
            {Login && (
              <p className="text-sm text-blue-600 cursor-pointer text-center">
                forget password ?
              </p>
            )}
          </form>

          {/* Login Redirect */}
          <div className="mt-6">
            <button
              onClick={() => setIsLogin((prev) => !prev)}
              className="w-full cursor-pointer border rounded py-2 bg-green-50 hover:bg-green-100 transition"
            >
              {Login
                ? "Don't have an account? SignUp"
                : "Have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
