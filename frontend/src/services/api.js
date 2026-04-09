const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const jobService = {
  getAll: () => apiFetch('/jobs'),
  create: (jobData) => apiFetch('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
  update: (id, jobData) => apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(jobData) }),
  delete: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),
}

export const authService = {
  login: (credentials) => apiFetch('/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/users', { method: 'POST', body: JSON.stringify(userData) }),
}