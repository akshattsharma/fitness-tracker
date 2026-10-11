import React, { useState } from "react";
import { useSnackbar } from "notistack";

const today = () => new Date().toISOString().slice(0, 10);

export default function DataForm({ initial, onSubmit, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    date: initial?.date ?? today(),
    intake: initial?.intake ?? "",
    burned: initial?.burned ?? "",
    description: initial?.description ?? "",
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.date || form.intake === "" || form.burned === "" || !form.description.trim()) {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
      return;
    }
    if (Number(form.intake) < 0 || Number(form.burned) < 0) {
      enqueueSnackbar("Calories can't be negative", { variant: "error" });
      return;
    }
    onSubmit({
      date: form.date,
      intake: Number(form.intake),
      burned: Number(form.burned),
      description: form.description.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="form">
      <h2>Update Today's Data</h2>

      <label htmlFor="date">Date</label>
      <input id="date" name="date" type="date" value={form.date} onChange={change} />

      <label htmlFor="intake">Calories intake</label>
      <input
        id="intake" name="intake" type="number" min="0"
        placeholder="Enter Today's Calorie Intake"
        value={form.intake} onChange={change}
      />

      <label htmlFor="burned">Calories burned</label>
      <input
        id="burned" name="burned" type="number" min="0"
        placeholder="Enter Today's Calorie Burned"
        value={form.burned} onChange={change}
      />

      <label htmlFor="description">Short description</label>
      <input
        id="description" name="description" type="text"
        placeholder="Enter a short description"
        value={form.description} onChange={change}
      />

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Submit</button>
      </div>
    </form>
  );
}