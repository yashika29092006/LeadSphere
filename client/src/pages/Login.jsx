import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    //sends req to backend
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard} className="animate-in">
        <div style={styles.logoBox}>LS</div>
        <h2 style={styles.title}>Welcome to LeadSphere</h2>
        <p style={{ color: '#6B7280', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Your intelligent Sales and CRM command center.
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Business Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="e.g. name@company.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Secure Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}>
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    background: 'linear-gradient(135deg, #0A66C2 0%, #174ea6 100%)',
    position: 'relative', overflow: 'hidden'
  },
  glassCard: {
    width: '100%', maxWidth: '440px', backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '3rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  },
  logoBox: { width: '50px', height: '50px', backgroundColor: '#0A66C2', color: '#FFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(10, 102, 194, 0.4)' },
  title: { fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.025em' },
  form: { width: '100%' },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem', color: '#374151' },
  inputGroup: { marginBottom: '1.25rem' },
  error: { color: '#EF4444', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', border: '1px solid #FEE2E2' }
};

export default Login;
