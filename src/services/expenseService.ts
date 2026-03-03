import type { Expense } from "../types/Expense";

const API_URL = import.meta.env.VITE_API_URL;

export const getExpenses = async (userId: number): Promise<Expense[]> => {
  const response = await fetch(`${API_URL}/expenses?userId=${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
};

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses/${expense.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Failed to update expense");
  }

  return response.json();
};

export const addExpense = async (
  expense: Omit<Expense, "id">,
): Promise<Expense> => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Failed to add expense");
  }

  return response.json();
};

export const deleteExpense = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete expense");
  }
};
