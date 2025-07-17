// import { create } from "zustand";
// import axios from "axios";
// import toast from "react-hot-toast";

// interface Transaction {
//  category:string
//  type:string
//  amount:number
//  date:Date
//  note:string
// }

// interface TransactionStore{
//  transaction:Transaction|null
//  isLoading:boolean
//  error:string |null
 
// getAllTransactions:()=>Promise<any>
// getTransaction:()=>Promise<any>,
// updateTransaction:(id:number)=>Promise<any>
// deleteTransaction:(id:number)=>Promise<void>
// }
// const useTransactionStore = create<TransactionStore>((set)=>({
//   transaction:null,
//   isLoading:false,
//   error:null,

//   getAllTransactions:async()=>{
//    set({isLoading:true});
//    try {
//     const {data} = await axios.get("http://localhost:8080/api/v1/transaction/get-transactions",{withCredentials:true});
//     set({transaction:data?.data})
//    } catch (error:any) {
//     set({isLoading:false})
//     toast.error(error?.data?.message)
//    }finally{
//   set({isLoading:false})
//    }
//   },
//   createTransaction:async(transaction: Transaction)=>{
//     set({isLoading:true});
//     try {
//        const {data} = await axios.post("http://localhost:8080/api/v1/transaction/get-transactions",transaction,{withCredentials:true});
//     set({transaction:data?.data})
//     toast.success()
//     } catch (error) {
      
//     }
//   },
//   updateTransaction:async(id:number,transaction:Transaction)=>{
//     set({isLoading:true});
//     try {
//       const {data} = await axios.put(`http://localhost:8080/api/v1/transaction/get-transactions/${id}`,transaction,{withCredentials:true});
//     set({transaction:data?.data})
//     } catch (error) {
      
//     }
//   },
//   deleteTransaction:(id:number)=>{
//    set({isLoading:true})
//   }

// }))

import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// Enum categories
export const categoryEnum = [
  "Food",
  "Rent",
  "Salary",
  "Transport",
  "Shopping",
  "Investment",
  "Other",
] as const;

// Category type
export type Category = (typeof categoryEnum)[number];

// Transaction type
export interface TransactionInput {
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string | Date;
  note: string;
}

export interface Transaction extends TransactionInput {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}


// Store Interface
interface TransactionStore {
  transactions: Transaction[];  // all user transactions
  isLoading: boolean;
  error: string | null;

  getAllTransactions: () => Promise<void>;
  createTransaction: (tx: Omit<Transaction, 'id' | 'userId' | 'deleted' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: number, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  getAllTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/transaction/get-transactions", {
        withCredentials: true,
      });
      set({ transactions: data?.data || [] });
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch transactions");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post("http://localhost:8080/api/v1/transaction/create", transaction, {
        withCredentials: true,
      });
      set((state) => ({
        transactions: [...state.transactions, data?.data],
      }));
      toast.success("Transaction created");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create transaction");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`http://localhost:8080/api/v1/transaction/update/${id}`, transaction, {
        withCredentials: true,
      });
      set((state) => ({
        transactions: state.transactions.map((tx) => (tx.id === id ? data?.data : tx)),
      }));
      toast.success("Transaction updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update transaction");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`http://localhost:8080/api/v1/transaction/delete/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      }));
      toast.success("Transaction deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete transaction");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
