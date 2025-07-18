import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";


interface Signup {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
}

interface Auth {
  
  authUser: any | null;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isVerified: boolean;
  isVerifying: boolean;
   isLoggedIn:boolean
  checkAuth: () => Promise<void>;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (userData: Signup) => Promise<void>;
}

export const useAuthStore = create<Auth>((set) => ({

  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: false,
  isVerifying: false,
  isVerified: false,
isLoggedIn:false,


  checkAuth: async () => {
   
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("http://localhost:8080/api/v1/auth/check", {
        withCredentials: true, 
      });
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  sendOtp: async (email) => {
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/send-otp", { email });
      toast.success(res.data?.message || "OTP sent successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isVerifying: true });
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/verify-otp", { email, otp });
      set({ isVerified: true });
      toast.success(res.data?.message || "OTP verified successfully");
      return true;
    } catch (error: any) {
      set({ isVerified: false });
      toast.error(error?.response?.data?.message || "OTP verification failed");
      return false;
    } finally {
      set({ isVerifying: false });
    }
  },

  login: async  ({ email, password })=> {

  set({ isLoggingIn: true });
  try {
    const res = await axios.post(
      "http://localhost:8080/api/v1/auth/login", // Fix typo here too
      { email, password },
      { withCredentials: true }
    );
    toast.success(res.data?.message || "Login successful");
    set({ authUser: res.data.user });
    set({isLoggedIn:true})
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    set({ isLoggingIn: false });
  }
},


  signup: async (userData: Signup) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/signup", 
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          address: userData.address,
          phone: userData.phone,
        },
       
      );
      toast.success(res.data?.message || "Signup successful");
      set({ authUser: res.data.user });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
