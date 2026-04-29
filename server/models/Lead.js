import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  website: { type: String },
  industry: { type: String },
  annualRevenue: { type: Number, default: 0 },
  source: { type: String, enum: ['Website', 'Social', 'Manual', 'CSV'], default: 'Manual' },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'], default: 'New' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
