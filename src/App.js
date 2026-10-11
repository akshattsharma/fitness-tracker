import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useSnackbar } from "notistack";
import DataForm from "./DataForm";
import Charts from "./Charts";
import RecentList from "./RecentList";

Modal.setAppElement("#root");

const STORAGE_KEY = "healthAndFitness";

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

export default function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [entries, setEntries] = useState(load);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [entries]
  );

  const totals = useMemo(() => {
    const intake = entries.reduce((s, e) => s + Number(e.intake), 0);
    const burned = entries.reduce((s, e) => s + Number(e.burned), 0);
    return { intake, burned, net: intake - burned };
  }, [entries]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (entry) => {
    setEditing(entry);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const save = (data) => {
    if (editing) {
      setEntries((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      enqueueSnackbar("Data updated", { variant: "success" });
    } else {
      setEntries((prev) => [...prev, { id: Date.now(), ...data }]);
      enqueueSnackbar("Data added", { variant: "success" });
    }
    close();
  };

  const remove = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    enqueueSnackbar("Data deleted", { variant: "info" });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Health And Fitness Tracker</h1>
        <button className="btn primary" onClick={openAdd}>+ Add data</button>
      </header>

      <section className="summary" aria-label="Totals">
        <div className="stat"><span className="stat-label">Calories in</span><strong>{totals.intake}</strong></div>
        <div className="stat"><span className="stat-label">Calories burned</span><strong>{totals.burned}</strong></div>
        <div className="stat"><span className="stat-label">Net</span><strong>{totals.net}</strong></div>
      </section>

      <Charts entries={sorted} totals={totals} />
      <RecentList entries={sorted} onEdit={openEdit} onDelete={remove} />

      <Modal
        isOpen={open}
        onRequestClose={close}
        className="modal"
        overlayClassName="overlay"
        contentLabel="Update Today's Data"
      >
        <DataForm initial={editing} onSubmit={save} onCancel={close} />
      </Modal>
    </div>
  );
}