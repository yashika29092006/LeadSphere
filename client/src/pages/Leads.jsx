import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //form data store
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    website: "",
    industry: "",
    annualRevenue: 0,
  });

  const fetchLeads = async () => {
    try {
      const { data } = await api.get("/leads");
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };
  //I used useEffect to fetch data when the component
  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };
  //add lead and Form submit
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", newLead);
      setShowModal(false);
      setNewLead({
        name: "",
        email: "",
        company: "",
        phone: "",
        website: "",
        industry: "",
        annualRevenue: 0,
      });
      fetchLeads(); // refresh
    } catch (error) {
      console.error("Failed to create lead", error);
    }
  };
//lead convert
  const handleConvert = async (id) => {
    try {
      await api.put(`/leads/${id}/convert`);
      fetchLeads(); // refresh status
      alert(
        "Lead Converted! Deal, Account, and Contact created on the Backend!",
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to convert");
    }
  };

  return (
    <div>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "1.5rem" }}
      >
        <h2 style={{ color: "#0A66C2" }}>Leads Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Lead
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent} className="card">
            <h3 style={{ marginBottom: "1rem", color: "#0A66C2" }}>
              Add New Lead
            </h3>
            <form
              onSubmit={handleAddLead}
              style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newLead.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newLead.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={newLead.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label style={styles.label}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={newLead.company}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={newLead.website}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label style={styles.label}>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={newLead.industry}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={styles.label}>Annual Revenue ($)</label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={newLead.annualRevenue}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Website</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No leads yet.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <strong>{lead.name}</strong>
                </td>
                <td>{lead.company}</td>
                <td>
                  <small style={{ color: "#0A66C2" }}>
                    {lead.website || "-"}
                  </small>
                </td>
                <td>
                  <span className="badge badge-blue">
                    {lead.industry || "-"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${lead.status === "New" ? "badge-blue" : lead.status === "Converted" ? "badge-green" : "badge-yellow"}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>
                  {lead.status !== "Converted" ? (
                    <button
                      onClick={() => handleConvert(lead._id)}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                    >
                      Convert
                    </button>
                  ) : (
                    <span
                      style={{
                        color: "#10B981",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle size={16} style={{ marginRight: "4px" }} />{" "}
                      Done
                    </span>
                  )}
                </td>
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

export default Leads;
