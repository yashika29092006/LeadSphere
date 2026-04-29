import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  stage: { 
    type: String, 
    enum: ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Qualification'
  },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Deal', dealSchema);
