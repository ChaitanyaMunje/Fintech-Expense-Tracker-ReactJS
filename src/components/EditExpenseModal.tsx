import { useState, useEffect } from "react";
import type { Expense } from "../types/Expense";

interface Props {
  expense: Expense | null;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

const EditExpenseModal = ({ expense, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState<Expense | null>(expense);

  useEffect(() => {
    setFormData(expense);
  }, [expense]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
          }
        : null,
    );
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div
      className="modal show d-block fade"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>Edit Expense</h5>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-control mb-3"
          />

          <button className="btn btn-primary me-2 mb-2" onClick={handleSubmit}>
            Save
          </button>

          <button className="btn btn-secondary mb-2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;
