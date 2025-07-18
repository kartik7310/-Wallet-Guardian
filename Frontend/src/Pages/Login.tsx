import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { useState } from "react";


const Login = () => {

  interface LoginData{
    email:string
    password:string
  }
  const[user,setUser] = useState<LoginData>({email:"",password:""})
  const { login, isLoggingIn} = useAuthStore();

  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prev)=>  ({...prev,[name]:value}))
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   const {email,password} = user;
   login({email,password});
   setUser({email:"",password:""});
   
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Login to Your Account
        </h2>

        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={inputHandler}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={inputHandler}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200"
          disabled={isLoggingIn}
        >
         {isLoggingIn? "Loading...":"Login"}
        </button>

        {/* Redirect Text */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
