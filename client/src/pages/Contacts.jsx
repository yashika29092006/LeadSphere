import { useState, useEffect } from 'react';
import api from '../services/api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  //dropdown acc list
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', accountId: '' });

  const fetchData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        api.get('/contacts'),
        api.get('/accounts')
      ]);
      setContacts(cRes.data);
      setAccounts(aRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', newContact);
      setShowModal(false);
      setNewContact({ name: '', email: '', phone: '', accountId: '' });
      fetchData();
    } catch (err) {
      alert('Error creating contact');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0A66C2' }}>Contacts Directory</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Contact</button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="card">
            <h3 style={{ marginBottom: '1rem', color: '#0A66C2' }}>Add New Contact</h3>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Name</label>
              <input type="text" className="input" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} required />
              
              <label style={styles.label}>Email</label>
              <input type="email" className="input" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} required />
              
              <label style={styles.label}>Phone</label>
              <input type="text" className="input" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
              
              <label style={styles.label}>Link Account</label>
              <select className="input" value={newContact.accountId} onChange={e => setNewContact({...newContact, accountId: e.target.value})} required>
                <option value="">Select Account</option>
                {accounts.map(a => <option key={a._id} value={a._id}>{a.companyName}</option>)}
              </select>

              <div className="flex justify-between" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Account</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center'}}>No contacts yet.</td></tr>}
            {contacts.map(c => (
              <tr key={c._id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td>{c.phone || '-'}</td>
                <td><span className="badge badge-blue">{c.accountId?.companyName || '-'}</span></td>
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

export default Contacts;
