import { useState, useEffect } from 'react';
import api from '../services/api'; 
import KanbanBoard from '../components/KanbanBoard';
import ActivityTimeline from '../components/ActivityTimeline';

const Deals = () => {
  // pipeline data
  const [deals, setDeals] = useState([]);
  //   dropdown data
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // clicked deal details
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [newDeal, setNewDeal] = useState({
    title: "",
    value: 0,
    stage: "Qualification",
    contactId: "",
    accountId: "",
  });

  const fetchData = async () => {
    try {
      const [dRes, aRes, cRes] = await Promise.all([
        api.get("/deals"),
        api.get("/accounts"),
        api.get("/contacts"),
      ]);
      setDeals(dRes.data);
      setAccounts(aRes.data);
      setContacts(cRes.data);
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
      await api.post("/deals", newDeal);
      setShowModal(false);
      setNewDeal({
        title: "",
        value: 0,
        stage: "Qualification",
        contactId: "",
        accountId: "",
      });
      fetchData();
    } catch (err) {
      alert("Error creating deal");
    }
  };

  return (
    <div>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "1.5rem" }}
      >
        <h2 style={{ color: "#0A66C2" }}>Deals Pipeline</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Deal
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="card">
            <h3 style={{ marginBottom: "1rem", color: "#0A66C2" }}>
              Add New Deal
            </h3>
            <form onSubmit={handleAdd}>
              <label style={styles.label}>Deal Title</label>
              <input
                type="text"
                className="input"
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, title: e.target.value })
                }
                required
              />

              <label style={styles.label}>Value ($)</label>
              <input
                type="number"
                className="input"
                value={newDeal.value}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, value: e.target.value })
                }
              />

              <label style={styles.label}>Stage</label>
              <select
                className="input"
                value={newDeal.stage}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, stage: e.target.value })
                }
              >
                <option value="Qualification">Qualification</option>
                <option value="Needs Analysis">Needs Analysis</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>

              <label style={styles.label}>Link Account</label>
              <select
                className="input"
                value={newDeal.accountId}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, accountId: e.target.value })
                }
                required
              >
                <option value="">Select Account</option>
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.companyName}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Link Contact</label>
              <select
                className="input"
                value={newDeal.contactId}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, contactId: e.target.value })
                }
                required
              >
                <option value="">Select Contact</option>
                {contacts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div
                className="flex justify-between"
                style={{ marginTop: "1rem" }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div style={{ gridColumn: "span 2" }}>
          <KanbanBoard
            deals={deals}
            refreshDeals={fetchData}
            onDealClick={setSelectedDeal}
          />
        </div>
        <div>
          {selectedDeal ? (
            <div>
              <div className="card">
                <h3 style={{ color: "#0A66C2" }}>{selectedDeal.title}</h3>
                <p>
                  Status: <strong>{selectedDeal.stage}</strong>
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                  onClick={() => setSelectedDeal(null)}
                >
                  Close Details
                </button>
              </div>
              <ActivityTimeline entityType="Deal" entityId={selectedDeal._id} />
            </div>
          ) : (
            <div
              className="card"
              style={{ textAlign: "center", color: "#6B7280" }}
            >
              <p>Click a deal to view its timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { width: '100%', maxWidth: '400px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.2rem' }
};

export default Deals;
