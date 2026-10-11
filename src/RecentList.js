import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function RecentList({ entries, onEdit, onDelete }) {
  return (
    <section className="panel recent">
      <h2>Recent Health Statistics</h2>
      {entries.length === 0 ? (
        <p className="muted">No entries yet. Use “+ Add data” to log your first day.</p>
      ) : (
        <ul className="list">
          {entries.map((e) => (
            <li key={e.id} className="row">
              <div className="row-main">
                <span className="row-date">{e.date}</span>
                <span className="row-desc">{e.description}</span>
              </div>
              <div className="row-nums">
                <span className="in">{`Calories Intake = ${e.intake}`}</span>
                <span className="out">{`Calories Burned = ${e.burned}`}</span>
              </div>
              <div className="row-actions">
                <button className="icon-btn" aria-label="Edit" title="Edit" onClick={() => onEdit(e)}><FiEdit2 /></button>
                <button className="icon-btn danger" aria-label="Delete" title="Delete" onClick={() => onDelete(e.id)}><FiTrash2 /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}