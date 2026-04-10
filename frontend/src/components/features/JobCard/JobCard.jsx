import styles from "./JobCard.module.css";

const STATUS_COLORS = {
  Saved: styles.statusSaved,
  Applied: styles.statusApplied,
  Interview: styles.statusInterview,
  Offer: styles.statusOffer,
  Rejected: styles.statusRejected,
};

export default function JobCard({ job, onDelete, onEdit, isUpdating }) {
  return (
    <div className={`${styles.card} ${isUpdating ? styles.loading : ""}`}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{job.title}</h3>
          <span className={`${styles.badge} ${STATUS_COLORS[job.status]}`}>
            {job.status}
          </span>
        </div>
        <p className={styles.company}>
          {job.company} • {job.location || "Remote"}
        </p>
        <span className={styles.priorityLabel}>
          {job.priority === "High"
            ? "🔴"
            : job.priority === "Medium"
              ? "🟡"
              : "⚪"}{" "}
          {job.priority}
        </span>
        {job.notes && <p className={styles.notesExcerpt}>{job.notes}</p>}
      </div>
      <div className={styles.controls}>
        <div className={styles.leftActions}>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noreferrer"
              className={styles.linkIcon}
            >
              🔗
            </a>
          )}
          <button onClick={onEdit} className={styles.editBtn}>
            ✏️
          </button>
        </div>
        <button
          disabled={isUpdating}
          onClick={() => onDelete(job._id)}
          className={styles.deleteBtn}
        >
          {isUpdating ? "..." : "🗑️"}
        </button>
      </div>
    </div>
  );
}
