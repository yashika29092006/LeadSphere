import { useState, useEffect } from 'react';
import api from '../services/api';

const Accounts = () => {
  //db store
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ companyName: '', industry: '', website: '', annualRevenue: 0 });

  const fetchAccounts = async () => {
    try {
      const { data } = await api.get('/accounts');
      setAccounts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts', newAccount);
      setShowModal(false);
      setNewAccount({ companyName: '', industry: '', website: '', annualRevenue: 0 });
      fetchAccounts();
    } catch (err) {
      alert('Error creating account');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0A66C2' }}>Accounts Directory</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Account</button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="card">
            <h3 style={{ marginBottom: '1rem', color: '#0A66C2' }}>Add New Account</h3>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Company Name</label>
              <input type="text" className="input" value={newAccount.companyName} onChange={e => setNewAccount({...newAccount, companyName: e.target.value})} required />
              
              <label style={styles.label}>Industry</label>
              <input type="text" className="input" value={newAccount.industry} onChange={e => setNewAccount({...newAccount, industry: e.target.value})} />
              
              <label style={styles.label}>Website</label>
              <input type="text" className="input" value={newAccount.website} onChange={e => setNewAccount({...newAccount, website: e.target.value})} />
              
              <label style={styles.label}>Annual Revenue ($)</label>
              <input type="number" className="input" value={newAccount.annualRevenue} onChange={e => setNewAccount({...newAccount, annualRevenue: e.target.value})} />

              <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th><th>Industry</th><th>Website</th><th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && <tr><td colSpan="3" style={{textAlign: 'center'}}>No accounts found.</td></tr>}
            {accounts.map(a => (
              <tr key={a._id}>
                <td><strong>{a.companyName}</strong></td>
                <td><span className="badge badge-blue">{a.industry || '-'}</span></td>
                <td><a href={`http://${a.website}`} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', fontSize: '0.85rem' }}>{a.website || '-'}</a></td>
                <td><span style={{ fontWeight: 600 }}>${(a.annualRevenue || 0).toLocaleString()}</span></td>
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

export default Accounts;
