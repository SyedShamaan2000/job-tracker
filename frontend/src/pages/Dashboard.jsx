import { useState } from "react";
import { useJobs } from "../hooks/useJobs";
import { jobService } from "../services/api";
import JobCard from "../components/features/JobCard/JobCard";

export default function Dashboard() {
  const { jobs, isLoading, error, setJobs } = useJobs();
  const [isActionLoading, setIsActionLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    status: "Applied",
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    setIsActionLoading(id);
    try {
      await jobService.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setIsActionLoading("submitting");
    try {
      const newJob = await jobService.create(formData);
      setJobs((prev) => [newJob, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: "", company: "", location: "", status: "Applied" });
    } catch (err) {
      alert("Failed to add job: " + err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-500 font-medium">
          Loading your opportunities...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your job applications.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          + Add Job
        </button>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center">
            <p className="text-gray-400 text-lg">
              No jobs found. Start your hunt!
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              isUpdating={isActionLoading === job._id}
            />
          ))
        )}
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                New Application
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Company
                </label>
                <input
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Tech Corp"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Remote"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading === "submitting"}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {isActionLoading === "submitting"
                    ? "Creating..."
                    : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
