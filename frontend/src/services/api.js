const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If session expired (401), we might want to trigger a logout
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const data = await response.json();

    if (!response.ok) {
      // Throwing an object so we can pass the message directly to the Toast
      throw new Error(data.message || "An unexpected error occurred");
    }

    return data;
  } catch (error) {
    // Re-throw to be caught by the UI
    throw error;
  }
};

export const jobService = {
  getAll: () => apiFetch("/jobs"),
  create: (jobData) =>
    apiFetch("/jobs", { method: "POST", body: JSON.stringify(jobData) }),
  update: (id, jobData) =>
    apiFetch(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(jobData) }),
  delete: (id) => apiFetch(`/jobs/${id}`, { method: "DELETE" }),
};

export const authService = {
  login: (credentials) =>
    apiFetch("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiFetch("/users", { method: "POST", body: JSON.stringify(userData) }),
};
