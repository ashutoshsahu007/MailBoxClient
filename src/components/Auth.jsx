import React, { useState } from "react";

const Signup = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("please fill the all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("passwords do not match!");
      return;
    }

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A",
      {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.error.message);
          }
          return data;
        });
      })
      .then((data) => console.log(data))
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center space-x-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Pi-symbol.svg"
            alt="logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold text-blue-600">MyWebLink</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">Products</li>
          <li className="hover:text-blue-600 cursor-pointer">About Us</li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 text-gray-700 font-medium">
          <div className="hover:text-blue-600 cursor-pointer">Home</div>
          <div className="hover:text-blue-600 cursor-pointer">Products</div>
          <div className="hover:text-blue-600 cursor-pointer">About Us</div>
        </div>
      )}

      {/* Background Shape + Form */}
      <div className="relative flex flex-1 justify-center items-center px-4 sm:px-6">
        {/* Signup Card */}
        <div className="relative bg-white shadow-md border rounded-md w-full max-w-md p-6 sm:p-8 z-10">
          <h2 className="text-center text-2xl font-semibold mb-6">Sign Up</h2>

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
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
            >
              Sign up
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-6">
            <button className="w-full cursor-pointer border rounded py-2 bg-green-50 hover:bg-green-100 transition">
              Have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
