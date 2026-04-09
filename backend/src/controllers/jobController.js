import Job from '../models/Job.js'

// @desc    Get all jobs for logged in user
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc    Create a new job
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { title, company, location, link, status, priority, labels, notes } = req.body

    const job = new Job({
      user: req.user._id,
      title,
      company,
      location,
      link,
      status,
      priority,
      labels,
      notes
    })

    const createdJob = await job.save()
    res.status(201).json(createdJob)
  } catch (error) {
    res.status(400).json({ message: 'Invalid job data' })
  }
}

// @desc    Update a job
// @route   PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) return res.status(404).json({ message: 'Job not found' })

    // Check ownership
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    // Update fields (or use Object.assign)
    Object.assign(job, req.body)
    const updatedJob = await job.save()
    res.json(updatedJob)
  } catch (error) {
    res.status(400).json({ message: 'Update failed' })
  }
}

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job || job.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Job not found or unauthorized' })
    }

    await job.deleteOne()
    res.json({ message: 'Job removed' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}