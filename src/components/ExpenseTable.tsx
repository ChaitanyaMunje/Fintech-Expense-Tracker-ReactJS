import type { JSX } from "react";
import type { Expense } from "../types/Expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseTable = ({
  expenses,
  onDelete,
  onEdit,
}: ExpenseTableProps): JSX.Element => {
  if (expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  // function onEdit(_expense: Expense): void {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <table className="table table-hover align-middle">
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.title}</td>
            <td>₹{expense.amount}</td>
            <td>{expense.category}</td>
            <td>{expense.date}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </button>
            </td>

            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(expense)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseTable;
