import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  link: String,
  status: {
    type: String,
    required: true,
    enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Saved'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  labels: [String],
  notes: String
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)
export default Job