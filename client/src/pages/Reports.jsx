import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../services/api';

const Reports = () => {
  const [stats, setStats] = useState({
    leadsByStatus: [],
    dealsByStage: [],
    monthlyRevenue: []
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [lRes, dRes] = await Promise.all([
          api.get('/leads'),
          api.get('/deals')
        ]);
        
        const leadCounts = lRes.data.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {});
        const leadChartData = Object.keys(leadCounts).map(k => ({ name: k, count: leadCounts[k] }));

        const dealCounts = dRes.data.reduce((acc, deal) => {
          acc[deal.stage] = (acc[deal.stage] || 0) + 1;
          return acc;
        }, {});
        const dealChartData = Object.keys(dealCounts).map(k => ({ name: k, count: dealCounts[k] }));

        const revenueData = [
          { month: 'Jan', amount: 4000 },
          { month: 'Feb', amount: 3000 },
          { month: 'Mar', amount: 5000 },
          { month: 'Apr', amount: 8000 },
        ];

        setStats({
          leadsByStatus: leadChartData,
          dealsByStage: dealChartData,
          monthlyRevenue: revenueData
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  const COLORS = ['#0A66C2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div>
      <h2 style={{ color: '#0A66C2', marginBottom: '2rem' }}>Sales Analytics & Reports</h2>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="card">
          <h4 style={{ color: '#374151', marginBottom: '1.5rem' }}>Lead Pipeline Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.leadsByStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count">
                {stats.leadsByStatus.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ color: '#374151', marginBottom: '1.5rem' }}>Deals per Pipeline Stage</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.dealsByStage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0A66C2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h4 style={{ color: '#374151', marginBottom: '1.5rem' }}>Monthly Revenue Forecast</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
