import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const INTAKE = "#e8743b";
const BURNED = "#2f8f6b";
const EMPTY = "#d9dde3";
const DAY = 24 * 60 * 60 * 1000;

const fmt = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function Charts({ entries, totals }) {
  // Last week = 7 days ending at the most recent entry; same-day entries are combined.
  const weekly = useMemo(() => {
    if (!entries.length) return [];
    const latest = new Date(entries[0].date + "T00:00:00").getTime();
    const byDate = {};
    entries.forEach((e) => {
      const t = new Date(e.date + "T00:00:00").getTime();
      if (latest - t < 7 * DAY) {
        byDate[e.date] = byDate[e.date] || { date: e.date, intake: 0, burned: 0 };
        byDate[e.date].intake += Number(e.intake);
        byDate[e.date].burned += Number(e.burned);
      }
    });
    return Object.values(byDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((d) => ({ ...d, label: fmt(d.date) }));
  }, [entries]);

  const hasData = totals.intake + totals.burned > 0;
  const pieData = hasData
    ? [
        { name: "Calories intake", value: totals.intake, color: INTAKE },
        { name: "Calories burned", value: totals.burned, color: BURNED },
      ]
    : [{ name: "No data yet", value: 1, color: EMPTY }];

  return (
    <section className="charts">
      {entries.length > 0 && (
        <div className="panel">
          <h2>Weekly Health Trends</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="intake" name="Calories intake" fill={INTAKE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="burned" name="Calories burned" fill={BURNED} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="panel">
        <h2>Overall Data</h2>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={hasData ? 2 : 0}>
                {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              {hasData && <Tooltip />}
              {hasData && <Legend />}
            </PieChart>
          </ResponsiveContainer>
          {!hasData && <p className="empty-note">Add data to see your totals</p>}
        </div>
      </div>
    </section>
  );
}