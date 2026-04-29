import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Inbox, Briefcase, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  // summary data
  const [metrics, setMetrics] = useState({
    leads: 0,
    deals: 0,
    revenue: 0,
    conversion: 0,
  });
  // latest deals
  const [recentDeals, setRecentDeals] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [leadsResponse, dealsResponse] = await Promise.all([
        api.get("/leads"),
        api.get("/deals"),
      ]);

      const leads = leadsResponse.data;
      const deals = dealsResponse.data;

      const convertedLeads = leads.filter(
        (lead) => lead.status === "Converted",
      );
      const convertedCount = convertedLeads.length;

      const totalRevenue = deals
        .filter((deal) => deal.stage === "Closed Won")
        .reduce((sum, deal) => sum + deal.value, 0);

      const conversionRate =
        leads.length > 0
          ? ((convertedCount / leads.length) * 100).toFixed(1)
          : 0;

      setMetrics({
        leads: leads.length,
        deals: deals.length,
        revenue: totalRevenue,
        conversion: conversionRate,
      });

      const latestFiveDeals = deals.slice(-5).reverse();
      setRecentDeals(latestFiveDeals);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2 style={{ color: "#0A66C2", marginBottom: "1.5rem" }}>
        Welcome back, {user?.name || "User"}!
      </h2>

      <div className="grid grid-cols-4 gap-2" style={{ marginBottom: "2rem" }}>
        <MetricCard
          title="Total Leads"
          value={metrics.leads}
          icon={<Inbox color="#3B82F6" size={32} />}
          color="#3B82F6"
        />
        <MetricCard
          title="Open Deals"
          value={metrics.deals}
          icon={<Briefcase color="#8B5CF6" size={32} />}
          color="#8B5CF6"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          icon={<DollarSign color="#10B981" size={32} />}
          color="#10B981"
        />
        <MetricCard
          title="Conversion %"
          value={`${metrics.conversion}%`}
          icon={<TrendingUp color="#F59E0B" size={32} />}
          color="#F59E0B"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h4 style={{ color: "#374151", marginBottom: "1rem" }}>
            Revenue Impact (Monthly)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0A66C2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ color: "#374151", marginBottom: "1rem" }}>
            Recent Deals
          </h4>
          {recentDeals.map((deal) => (
            <div key={deal._id} style={styles.dealItem}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>
                {deal.title}
              </p>
              <small style={{ color: "#10B981" }}>
                ${deal.value.toLocaleString()} - {deal.stage}
              </small>
            </div>
          ))}

          {recentDeals.length === 0 && (
            <p style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>
              No recent deals found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <div className="card flex items-center gap-2" style={{ borderLeft: `6px solid ${color}` }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div>
        <small style={{ color: '#6B7280', display: 'block' }}>{title}</small>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{value}</span>
      </div>
    </div>
  );
};

const mockChartData = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 700 },
  { month: 'Mar', value: 900 },
  { month: 'Apr', value: 1200 }
];

const styles = {
  dealItem: { 
    padding: '0.75rem 0', 
    borderBottom: '1px solid #F3F4F6' 
  }
};

export default Dashboard;
