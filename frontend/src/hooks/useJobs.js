import { useState, useEffect } from 'react'
import { jobService } from '../services/api'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const data = await jobService.getAll()
      setJobs(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return { jobs, isLoading, error, setJobs, refresh: fetchJobs }
}