import { useState, useEffect } from 'react';
import api from '../services/api';

const ActivityTimeline = (props) => {
  // props extraction
  const { entityType, entityId } = props;

  const [activities, setActivities] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    type: "Notes",
    description: "",
  });

  const fetchActivities = async () => {
    try {
      const response = await api.get(`/activities/${entityType}/${entityId}`);
      setActivities(response.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchActivities();
    }
  }, [entityId]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    //Dynamic form update
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/activities", {
        ...formData,
        relatedEntity: entityType,
        entityId: entityId,
      });

      setFormData({ type: "Notes", description: "" });
      setShowForm(false);
      fetchActivities();
    } catch (err) {
      alert("Failed to save your activity. Please try again.");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div
      className="card"
      style={{ marginTop: "1.5rem", backgroundColor: "#F9FAFB" }}
    >
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "1rem" }}
      >
        <h4 style={{ color: "#0A66C2", margin: 0 }}>Activity Timeline</h4>
        <button
          className="btn btn-secondary"
          style={{ fontSize: "0.8rem" }}
          onClick={toggleForm}
        >
          {showForm ? "Cancel" : "+ Log Activity"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div className="flex gap-2" style={{ marginBottom: "0.5rem" }}>
            <select
              name="type"
              className="input"
              style={{ width: "120px" }}
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Task">Task</option>
              <option value="Notes">Notes</option>
            </select>

            <input
              name="description"
              className="input"
              placeholder="What happened? (e.g. Sent proposal, Called customer)"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Save Activity
          </button>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {activities.length === 0 && (
          <p
            style={{
              color: "#6B7280",
              textAlign: "center",
              fontSize: "0.85rem",
            }}
          >
            No activities logged yet.
          </p>
        )}

        {activities.map((activity) => {
          const formattedDate = new Date(activity.createdAt).toLocaleString();

          return (
            <div key={activity._id} style={styles.activityItem}>
              <span
                style={{
                  ...styles.typeBadge,
                  backgroundColor: styles.colors[activity.type] || "#6B7280",
                }}
              >
                {activity.type}
              </span>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#1F2937" }}>
                  {activity.description}
                </p>
                <small style={{ color: "#9CA3AF" }}>{formattedDate}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  formContainer: { 
    marginBottom: '1.5rem', 
    backgroundColor: '#FFF', 
    padding: '1rem', 
    borderRadius: '8px', 
    border: '1px solid #E5E7EB' 
  },
  activityItem: { 
    display: 'flex', 
    gap: '1rem', 
    alignItems: 'flex-start', 
    borderBottom: '1px solid #E5E7EB', 
    paddingBottom: '0.75rem' 
  },
  typeBadge: { 
    fontSize: '0.7rem', 
    color: '#FFF', 
    padding: '0.1rem 0.4rem', 
    borderRadius: '4px', 
    textTransform: 'uppercase', 
    fontWeight: 'bold', 
    width: '60px', 
    textAlign: 'center' 
  },
  colors: { 
    'Call': '#3B82F6', 
    'Meeting': '#8B5CF6', 
    'Task': '#F59E0B', 
    'Notes': '#6B7280' 
  }
};

export default ActivityTimeline;
