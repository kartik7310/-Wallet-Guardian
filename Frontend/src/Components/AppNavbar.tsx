import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { Menu, X } from "lucide-react";

const AppNavbar = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    ...(isLoggedIn
      ? [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Transactions", path: "/transactions" },
          { label: "Budget", path: "/budget" },
        ]
      : []),
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 tracking-wide"
          >
            WalletGuardian
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition duration-200 ${
                  location.pathname === item.path
                    ? "text-indigo-600 underline underline-offset-4"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <Link
                to="/login"
                className="ml-4 text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-indigo-600"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow-md space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium ${
                location.pathname === item.path
                  ? "text-indigo-600 underline underline-offset-4"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {!isLoggedIn && (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md mt-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;
