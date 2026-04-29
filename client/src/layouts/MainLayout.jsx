import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <Navbar />
        <main style={styles.content} className="animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
  content: { flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#F8FAFC' }
};

export default MainLayout;
