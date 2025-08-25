import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../store/auth-context";
import { LogOut } from "lucide-react";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ active link class
  const linkClasses = ({ isActive }) =>
    `transition-colors ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-6 md:px-12 py-4 sticky top-0 z-50">
      {/* Logo */}
      <NavLink to="/" className="flex items-center space-x-2">
        <img src="/gmail.png" alt="logo" className="w-8 h-8" />
        <span className="text-2xl md:text-3xl font-bold text-[#EA4335]">
          MailBoxClient
        </span>
      </NavLink>

      {/* Desktop Menu */}
      {authCtx.isLoggedIn && (
        <ul className="hidden md:flex md:items-center space-x-6 font-medium">
          <li>
            <NavLink to="/compose" className={linkClasses}>
              Compose
            </NavLink>
          </li>
          <li>
            <NavLink to="/inbox" className={linkClasses}>
              Inbox
            </NavLink>
          </li>
          <li>
            <NavLink to="/sentbox" className={linkClasses}>
              Sentbox
            </NavLink>
          </li>
          <li>
            <button
              onClick={authCtx.logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      )}

      {/* Mobile Hamburger */}
      {authCtx.isLoggedIn && (
        <div className="md:hidden relative">
          <button
            className="flex flex-col space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
          </button>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <ul className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg flex flex-col p-4 space-y-3 font-medium z-50">
              <li>
                <NavLink
                  to="/compose"
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  Compose
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inbox"
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  Inbox
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sentbox"
                  className={linkClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  Sentbox
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    authCtx.logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
