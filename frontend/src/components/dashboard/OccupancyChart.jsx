import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import './DashboardComponents.css';

export default function OccupancyChart({ data }) {
  return (
    <section className="dashboard-panel">
      <div className="panel-heading">
        <div>
          <h3>Hostel occupancy</h3>
          <p>Occupied beds compared with total capacity</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="chart-empty">No hostel occupancy data available.</div>
      ) : (
        <div className="occupancy-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 12, right: 12, left: -15, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9edf1"
              />

              <XAxis
                dataKey="hostelName"
                tick={{ fontSize: 11, fill: '#778494' }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#778494' }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  border: '1px solid #e5e9ee',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />

              <Bar
                dataKey="occupiedBeds"
                name="Occupied beds"
                fill="#315c78"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="availableBeds"
                name="Available beds"
                fill="#dce7ed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}