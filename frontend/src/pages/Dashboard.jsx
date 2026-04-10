import { useState, useMemo } from "react";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/api";
import JobCard from "../components/features/JobCard/JobCard";
import styles from "./Dashboard.module.css";

const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];

const INITIAL_FORM_STATE = {
  title: "",
  company: "",
  location: "",
  status: "Saved",
  priority: "Medium",
  link: "",
  notes: "",
  labels: [],
};

export default function Dashboard() {
  const { jobs, isLoading, error, setJobs } = useJobs();
  const { logout, user } = useAuth();

  const [isActionLoading, setIsActionLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

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

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job._id);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location || "",
      status: job.status,
      priority: job.priority,
      link: job.link || "",
      notes: job.notes || "",
      labels: job.labels || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsActionLoading("submitting");
    try {
      if (editingJobId) {
        const updatedJob = await jobService.update(editingJobId, formData);
        setJobs(jobs.map((j) => (j._id === editingJobId ? updatedJob : j)));
      } else {
        const newJob = await jobService.create(formData);
        setJobs([newJob, ...jobs]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    setIsActionLoading(id);
    try {
      await jobService.delete(id);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading)
    return <div className={styles.container}>Loading applications...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1 className={styles.title}>Career Track</h1>
          <p className={styles.subtitle}>Welcome back, {user?.name}</p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleOpenCreateModal} className={styles.addBtn}>
            + Add Job
          </button>
          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Search company or position..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className={styles.selectFilter}
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
      </div>

      <div className={styles.grid}>
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onDelete={handleDelete}
            onEdit={() => handleOpenEditModal(job)}
            isUpdating={isActionLoading === job._id}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingJobId ? "Edit Application" : "New Application"}</h2>
            <form onSubmit={handleSubmit}>
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
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Location</label>
                  <input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Remote, NYC, etc."
                  />
                </div>
                <div className={styles.field}>
                  <label>Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="URL to posting"
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
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
