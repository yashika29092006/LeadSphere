import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav} className="flex justify-between items-center">
      <div style={styles.searchBox}>
        <Search size={18} color="#9CA3AF" style={{ marginRight: "8px" }} />
        <input style={styles.searchInput} placeholder="Search anything..." />
      </div>

      <div className="flex gap-2 items-center">
        <div style={styles.userSection}>
          {/* Uses optional chaining */}
          <div style={styles.avatar}>{user?.name?.[0] || "U"}</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.userRole}>{user?.role}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { height: '70px', padding: '0 2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 },
  searchBox: { border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: '#F8FAFC', width: '300px', display: 'flex', alignItems: 'center' },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%' },
  userSection: { display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '1rem', borderRight: '1px solid #E2E8F0' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0A66C2', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontWeight: '600', fontSize: '0.9rem', color: '#1E293B' },
  userRole: { fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }
};

export default Navbar;
