import styles from './JobCard.module.css'

export default function JobCard({ job, onDelete, onUpdate, isUpdating }) {
  return (
    <div className={`${styles.card} ${isUpdating ? styles.loadingOverlay : ''}`}>
      <div>
        <h3 className={styles.title}>{job.title}</h3>
        <p className={styles.company}>{job.company} • {job.location}</p>
      </div>
      <div className="flex gap-2">
        <button 
          disabled={isUpdating}
          onClick={() => onDelete(job._id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          {isUpdating ? '...' : '🗑️'}
        </button>
      </div>
    </div>
  )
}