import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Target, Users, Building2, Briefcase, LineChart, Settings } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Target size={20} /> },
    { name: 'Contacts', path: '/contacts', icon: <Users size={20} /> },
    { name: 'Accounts', path: '/accounts', icon: <Building2 size={20} /> },
    { name: 'Deals', path: '/deals', icon: <Briefcase size={20} /> },
    { name: 'Reports', path: '/reports', icon: <LineChart size={20} /> },
  ];

  if (isAdmin) menuItems.push({ name: 'User Management', path: '/users', icon: <Settings size={20} /> });

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoArea}>
        <div style={styles.logoBox}>LS</div>
        <span style={styles.logoText}>LeadSphere</span>
      </div>

      <ul style={styles.menu}>
        {menuItems.map((item) => (
          <li key={item.name} style={styles.li}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const styles = {
  sidebar: { width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', height: '100%', padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column' },
  logoArea: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.75rem', marginBottom: '2.5rem' },
  logoBox: { width: '40px', height: '40px', backgroundColor: '#0A66C2', borderRadius: '10px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 6px rgba(10, 102, 194, 0.2)' },
  logoText: { color: '#0A66C2', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' },
  menu: { listStyle: 'none', margin: 0, padding: 0 },
  li: { marginBottom: '0.25rem' },
  link: { display: 'flex', alignItems: 'center', padding: '0.85rem 1rem', textDecoration: 'none', color: '#64748B', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  activeLink: { backgroundColor: '#F1F5F9', color: '#0A66C2', fontWeight: 600, boxShadow: 'inset 0 0 0 1px #E2E8F0' },
  icon: { marginRight: '0.75rem', fontSize: '1.2rem', opacity: 0.8 },
};

export default Sidebar;
