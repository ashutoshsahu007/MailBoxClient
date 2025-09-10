import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAmJm5iEoE6G5BwhjS9KaQyt9RJaUqLF4A`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: email,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error?.message || "Something went wrong");
      }

      setMessage(
        "A password reset link has been sent to your email. Please check your inbox."
      );
      setEmail("");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gray-50">
      {/* Decorative Background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-red-200 rounded-full opacity-30 blur-3xl"></div>

      {/* Reset Card */}
      <div className="backdrop-blur-md shadow-xl rounded-3xl p-8 w-full max-w-md border relative z-10 bg-white/80 border-white/20">
        {/* App Branding Inside Card */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-blue-600">Mail</span>
            <span className="text-red-500">Box</span>
            <span className="text-gray-800">Client</span>
          </h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50/50 border-gray-200 text-gray-900 hover:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:opacity-90 text-white rounded-xl py-3.5 font-semibold transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending Reset Link...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Success */}
        {message && (
          <div className="mt-6 p-4 border rounded-xl flex items-start space-x-3 bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
            <p className="text-sm leading-relaxed text-green-700">{message}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 border rounded-xl flex items-start space-x-3 bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600" />
            <p className="text-sm leading-relaxed text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
