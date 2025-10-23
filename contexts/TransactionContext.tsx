import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '@/components/ui/CategorySelector';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  date: Date;
  category?: Category | null;
}

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
}

const TransactionContext = createContext<TransactionContextValue>({
  transactions: [],
  addTransaction: () => {},
  deleteTransaction: () => {},
  getTotalIncome: () => 0,
  getTotalExpense: () => 0,
  getBalance: () => 0,
});

const STORAGE_KEY = 'app_transactions';

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from storage on app start
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedTransactions = JSON.parse(stored).map((t: any) => ({
            ...t,
            date: new Date(t.date),
          }));
          setTransactions(parsedTransactions);
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    };
    loadTransactions();
  }, []);

  // Save transactions to storage whenever transactions change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error('Failed to save transactions:', error);
      }
    };
    if (transactions.length > 0) {
      saveTransactions();
    }
  }, [transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        getTotalIncome,
        getTotalExpense,
        getBalance,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}
