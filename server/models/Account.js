import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String },
  website: { type: String },
  annualRevenue: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
