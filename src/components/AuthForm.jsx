import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthContext from "../store/auth-context";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Login, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let url = "";

    if (Login) {
      if (!email || !password) {
        alert("please fill all fields");
        return;
      }
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A";
    } else {
      if (!email || !password || !confirmPassword) {
        alert("please fill all fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) =>
        response.json().then((data) => {
          if (!response.ok) throw new Error(data.error.message);
          return data;
        })
      )
      .then((data) => {
        !Login && alert("SignUp Successful");
        Login && authCtx.login(data.idToken, data.email);
        Login && navigate("/compose");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-200 rounded-full opacity-30 blur-3xl"></div>

      {/* Logo */}
      <div className="mb-10 flex items-center gap-2 relative z-10">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-blue-600">Mail</span>
          <span className="text-red-500">Box</span>
          <span className="text-gray-800">Client</span>
        </h1>
      </div>

      {/* Auth Card */}
      <div className="backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-md border relative z-10 bg-white/80 border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {Login ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600">
            {Login
              ? "Sign in to continue your journey"
              : "Join us and start your adventure"}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-12 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          {!Login && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-12 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          )}

          {/* Forgot Password */}
          {Login && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/forget-password")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:opacity-90 text-white rounded-xl py-3.5 font-semibold transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            {Login ? "Log In" : "Sign Up"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch Form */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {Login ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin((prev) => !prev)}
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {Login ? " Sign Up" : " Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
