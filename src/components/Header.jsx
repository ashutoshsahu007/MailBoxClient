import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";
import { LogOut } from "lucide-react";

const Header = () => {
  const authCtx = useContext(AuthContext);
  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50 ">
      <Link to="/" className="flex items-center space-x-2">
        <img src="/gmail.png" alt="logo" className="w-8 h-8" />
        <span className="text-3xl font-bold text-[#EA4335]">MailBoxClient</span>
      </Link>

      {/* Desktop Menu */}

      {authCtx.isLoggedIn && (
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/inbox">Inbox</Link>
          </li>

          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/sentbox">Sentbox</Link>
          </li>

          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/compose">Compose</Link>
          </li>
          <li>
            <button
              onClick={authCtx.logout}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      )}

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col space-y-1"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="w-6 h-0.5 bg-gray-800"></span>
        <span className="w-6 h-0.5 bg-gray-800"></span>
        <span className="w-6 h-0.5 bg-gray-800"></span>
      </button>
    </header>
  );
};

export default Header;
