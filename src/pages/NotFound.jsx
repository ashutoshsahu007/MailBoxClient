import { useNavigate } from "react-router-dom";
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-semibold">
            <span className="text-blue-600">Mail</span>
            <span className="text-red-500">Box</span>
            <span className="text-gray-800">Client</span>
          </span>
        </div>
      </div>

      {/* 404 Content */}
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4">
          {/* Normal Tailwind Buttons */}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-100 rounded-full opacity-20 blur-xl"></div>
    </div>
  );
}
