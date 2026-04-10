import { useState, useMemo } from "react";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";
import JobCard from "../components/features/JobCard/JobCard";
import styles from "./Dashboard.module.css";

const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];

export default function Dashboard() {
  const { jobs, isLoading, error, setJobs } = useJobs();
  const { logout, user } = useAuth();

  const [isActionLoading, setIsActionLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    status: "Saved",
    priority: "Medium",
    link: "",
    notes: "",
    labels: [],
  });

  // Memoized filtering logic for performance
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, filterStatus]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setIsActionLoading("submitting");
    try {
      const newJob = await jobService.create(formData);
      setJobs((prev) => [newJob, ...prev]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(`Failed to add job: ${err.message}`);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this application?")) return;
    setIsActionLoading(id);
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setIsActionLoading(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      status: "Saved",
      priority: "Medium",
      link: "",
      notes: "",
      labels: [],
    });
  };

  if (isLoading)
    return <div className={styles.loader}>Loading opportunities...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Job Hunt Tracker</h1>
          <p className={styles.subtitle}>
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <div className={styles.actions}>
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.addBtn}
          >
            + Add Job
          </button>
        </div>
      </header>

      <section className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search jobs or companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.selectInput}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </section>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.grid}>
        {filteredJobs.length === 0 ? (
          <div className={styles.emptyState}>
            No applications match your criteria.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              isUpdating={isActionLoading === job._id}
            />
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>New Application</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateJob} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Job Title*</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label>Company*</label>
                  <input
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label>URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading === "submitting"}
                  className={styles.saveBtn}
                >
                  {isActionLoading === "submitting"
                    ? "Saving..."
                    : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
