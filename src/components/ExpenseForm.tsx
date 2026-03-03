import { useState, type JSX } from "react";

interface ExpenseFormProps {
  onAdd: (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => void;
}

const ExpenseForm = ({ onAdd }: ExpenseFormProps): JSX.Element => {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAdd(formData);

    setFormData({
      title: "",
      amount: 0,
      category: "",
      date: "",
    });
  };

  return (
    <>
      <h4 className="mt-4">Add Expense</h4>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            name="amount"
            className="form-control"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            type="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            Add
          </button>
        </div>
      </form>
    </>
  );
};

export default ExpenseForm;
