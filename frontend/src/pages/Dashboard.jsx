import { useState } from 'react'
import { useJobs } from '../hooks/useJobs'
import { jobService } from '../services/api'
import JobCard from '../components/features/JobCard/JobCard'

export default function Dashboard() {
  const { jobs, isLoading, error, setJobs } = useJobs()
  const [isActionLoading, setIsActionLoading] = useState(null) // Stores ID of job being deleted/updated

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    
    setIsActionLoading(id)
    try {
      await jobService.delete(id)
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) {
      alert('Delete failed: ' + err.message)
    } finally {
      setIsActionLoading(null)
    }
  }

  if (isLoading) return <div className="p-10 text-center">Loading your opportunities...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Job Applications</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Job</button>
      </header>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No jobs found. Start your hunt!</p>
        ) : (
          jobs.map(job => (
            <JobCard 
              key={job._id} 
              job={job} 
              onDelete={handleDelete}
              isUpdating={isActionLoading === job._id}
            />
          ))
        )}
      </div>
    </div>
  )
}