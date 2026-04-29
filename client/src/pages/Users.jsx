import { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Sales Rep' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'Sales Rep' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0A66C2' }}>User Management (Admin)</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="card">
            <h3 style={{ marginBottom: '1rem', color: '#0A66C2' }}>Add New User</h3>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Full Name</label>
              <input type="text" className="input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              
              <label style={styles.label}>Email Address</label>
              <input type="email" className="input" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              
              <label style={styles.label}>Password</label>
              <input type="password" className="input" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              
              <label style={styles.label}>Role</label>
              <select className="input" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales Rep">Sales Rep</option>
              </select>

              <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td><span className="badge badge-blue">{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { width: '100%', maxWidth: '400px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }
};

export default Users;
