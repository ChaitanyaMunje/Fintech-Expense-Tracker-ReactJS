import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import type { Expense } from "../types/Expense";
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../services/expenseService";
import ExpenseTable from "../components/ExpenseTable";
import ExpenseForm from "../components/ExpenseForm";
import Navbar from "../components/NavBar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import EditExpenseModal from "../components/EditExpenseModal";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const { theme } = useTheme();

  interface ExpenseForm {
    title: string;
    amount: number;
    category: string;
    date: string;
  }

  const [formData, setFormData] = useState<ExpenseForm>({
    title: "",
    amount: 0,
    category: "",
    date: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
  };
  const handleSave = async (updated: Expense) => {
    const result = await updateExpense(updated);

    setExpenses((prev) =>
      prev.map((exp) => (exp.id === result.id ? result : exp)),
    );

    setSelectedExpense(null);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory =
        filterCategory === "all" || expense.category === filterCategory;

      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [expenses, filterCategory, searchTerm]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  }, [filteredExpenses]);

  const handleAdd = async (data: Omit<Expense, "id" | "userId">) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const newExpense = await addExpense({
      ...data,
      userId: user.id,
    });

    setExpenses((prev) => [...prev, newExpense]);
  };

  // const handleAddExpense = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   try {
  //     const user = JSON.parse(localStorage.getItem("user") || "{}");

  //     const newExpense = await addExpense({
  //       ...formData,
  //       userId: user.id,
  //     });

  //     // Update UI immediately
  //     setExpenses((prev) => [...prev, newExpense]);

  //     // Reset form
  //     setFormData({
  //       title: "",
  //       amount: 0,
  //       category: "",
  //       date: "",
  //     });
  //   } catch (error: any) {
  //     setError(error.message);
  //   }
  // };

  const handleDelete = async (id: number) => {
    try {
      await deleteExpense(id);

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = await getExpenses(user.id);
        setExpenses(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}
      >
        <div className="mx-auto" style={{ maxWidth: "1400px" }}>
          {/* <h2>Dashboard</h2>

      <button className="btn btn-danger mb-3" onClick={handleLogout}>
        Logout
      </button> */}

          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div
                className={`card shadow-sm border-0 p-4 ${
                  theme === "dark" ? "bg-secondary text-white" : ""
                }`}
              >
                <h6 className="text-muted">Total Expenses</h6>
                <h2 className="fw-bold text-primary">₹{totalExpense}</h2>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className={`card shadow-sm border-0 p-4 ${
                  theme === "dark" ? "bg-secondary text-white" : ""
                }`}
              >
                <h6 className="text-muted">Total Transactions</h6>
                <h2 className="fw-bold text-success">
                  {filteredExpenses.length}
                </h2>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className={`card shadow-sm border-0 p-4 ${
                  theme === "dark" ? "bg-secondary text-white" : ""
                }`}
              >
                <h6 className="text-muted">Categories</h6>
                <h2 className="fw-bold text-warning">
                  {new Set(filteredExpenses.map((e) => e.category)).size}
                </h2>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 p-4 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {[...new Set(expenses.map((e) => e.category))].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="mb-3 fw-bold">Add Expense</h5>
            <ExpenseForm onAdd={handleAdd} />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="card shadow-sm border-0 p-4">
              <ExpenseTable
                expenses={expenses}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          )}

          {selectedExpense && (
            <EditExpenseModal
              expense={selectedExpense}
              onClose={() => setSelectedExpense(null)}
              onSave={handleSave}
            />
          )}

          <div className="d-flex justify-content-center mt-3">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn mx-1 ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
