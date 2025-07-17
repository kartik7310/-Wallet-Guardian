import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

interface UpdateData {
  name?: string;
  address?: string;
  phone?: string;
}

interface Budget {
  category: string;
  plannedAmount: number;
  spentAmount: number;
  month: number;
  year: number;
}

interface Transaction {
  id: number;
  amount: number;
  category: string;
  type: string;
  date: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  budgets: Budget[];
  transactions: Transaction[];
  initials: string;
}

interface FetchUser {
  success: boolean;
  data: UserData;
}

interface UserStore {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;

  fetchUser: () => Promise<FetchUser | void>;
  update: (updateData: UpdateData) => Promise<void>;
  changePassword: (
    oldPass: string,
    newPass: string,
    confirmPass: string
  ) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUser: async (): Promise<FetchUser | void> => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/user/me", {
        withCredentials: true,
      });
      set({ userData: data.data });
      return { success: true, data: data.data };
    } catch (error: any) {
      set({ isLoading: false, error: error?.message });
      toast.error(error?.message || "Failed to fetch user");
    } finally {
      set({ isLoading: false });
    }
  },

  update: async (updateData) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/user/me",
        updateData,
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error?.message);
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (
    oldPass,
    newPass,
    confirmPass
  ) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/user/change-password",
        { oldPass, newPass, confirmPass },
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
