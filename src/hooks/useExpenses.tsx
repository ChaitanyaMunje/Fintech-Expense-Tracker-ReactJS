import { useEffect, useState, useMemo } from "react";
import type { Expense } from "../types/Expense";
import {
  getExpenses,
  addExpense,
  deleteExpense,
} from "../services/expenseService";

export const useExpenses = (userId: number) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses(userId);
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  const addNewExpense = async (data: Omit<Expense, "id">) => {
    const newExpense = await addExpense(data);
    setExpenses((prev) => [...prev, newExpense]);
  };

  const removeExpense = async (id: number) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return {
    expenses,
    loading,
    error,
    addNewExpense,
    removeExpense,
  };
};
