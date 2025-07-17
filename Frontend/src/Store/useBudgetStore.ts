
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";


export const categoryEnum = [
  "Food",
  "Rent",
  "Salary",
  "Transport",
  "Shopping",
  "Investment",
  "Other",
] as const;

export type Category = (typeof categoryEnum)[number];

export interface BudgetInput {
  category: Category;
  amount: number;
  month: number; // 1–12
  year: number;
  notes?: string;
}

export interface Budget extends BudgetInput {
  id: number;
  createdAt: string;
  updatedAt: string;
}

interface BudgetStore {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;


  getAllBudgets: () => Promise<void>;
  createBudget: (data: BudgetInput) => Promise<void>;
  updateBudget: (id: number, data: Partial<BudgetInput>) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgets: [],
  isLoading: false,
  error: null,

  getAllBudgets: async () => {
    try {
      set({ isLoading: true });
      const { data } = await axios.get("http://localhost:8080/api/v1/budget/get-budget", { withCredentials: true });
      set({ budgets: data.data });
      set({isLoading:false})
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch budgets" });
        set({isLoading:false})
    }
  },

  createBudget: async (input) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.post("http://localhost:8080/api/v1/budget/create-budget", input, { withCredentials: true });
      set({budgets:data?.data})
      toast.success(data?.message||"budget create successfully")
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create budget"});
      set({isLoading:false})
    }
  },

  updateBudget: async (updatedData) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.put("http://localhost:8080/api/v1/budget/update-budget", updatedData, { withCredentials: true });
      set({budgets:data?.data})
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update budget"});
       set({isLoading:false})
    }
  },

  deleteBudget: async (id) => {
    try {
      set({ isLoading: true });
      await axios.delete(`http://localhost:8080/api/v1/budget/budget-delete/${id}`, { withCredentials: true });
    toast.success("budget delete successfully")
     set({isLoading:false})
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to delete budget"});
       set({isLoading:false})
    }
  },
}));
