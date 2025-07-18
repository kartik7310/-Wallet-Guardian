import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { Menu, X } from "lucide-react"; // optional, can use your own icons

const HomeNavbar = () => {
  const { isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          WalletGuardian
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="hidden md:flex space-x-4">
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-md transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && !isLoggedIn && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          <Link
            to="/login"
            className="block text-gray-700 hover:text-indigo-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md transition"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
