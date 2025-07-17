import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Budget from "./Pages/Budget";
import Transaction from "./Pages/Transaction";
import VerifyOtp from "./Pages/VerifyOtp";
import Dashboard from "./Pages/Dashboard";
import Layout from "./layout/Layout";
import { useAuthStore } from "./Store/useAuthStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Loader UI */}
        <div className="terminal-loader relative border border-[#333] text-green-500 font-mono text-base px-4 py-6 w-48 shadow-lg rounded overflow-hidden box-border">
          <div className="terminal-header absolute top-0 left-0 right-0 h-6 bg-[#333] rounded-t px-2 box-border flex items-center justify-between">
            <div className="terminal-title text-gray-200 leading-6">Status</div>
            <div className="terminal-controls flex items-center space-x-1 ml-auto">
              <div className="control w-[0.6em] h-[0.6em] rounded-full bg-red-600"></div>
              <div className="control w-[0.6em] h-[0.6em] rounded-full bg-yellow-400"></div>
              <div className="control w-[0.6em] h-[0.6em] rounded-full bg-green-600"></div>
            </div>
          </div>
          <div className="text inline-block whitespace-nowrap overflow-hidden border-r-2 border-green-500 mt-6 animate-typeAndDelete">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="budget" element={authUser ? <Budget /> : <Navigate to="/login" />} />
        <Route path="transaction" element={authUser ? <Transaction /> : <Navigate to="/login" />} />
      </Route>

      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
      <Route path="/verify" element={!authUser ? <VerifyOtp /> : <Navigate to="/" />} />
    </Routes>

    </div>
  );
};

export default App;
