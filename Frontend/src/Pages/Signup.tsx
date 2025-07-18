import { Link } from "react-router-dom";

const SignUpForm = () => {
  
  return (
    <form className="w-full max-w-md mx-auto mt-12 bg-white p-6 rounded-2xl shadow-xl space-y-4 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center text-gray-800">Create Your Account</h2>
     

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Contact Number</label>
          <input
            type="text"
            placeholder="+91 9876543210"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-md hover:from-indigo-700 hover:to-purple-700 transition duration-200"
      >
        Sign Up
      </button>
       <p className="text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default SignUpForm;
