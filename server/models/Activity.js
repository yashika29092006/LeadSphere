import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ['Call', 'Meeting', 'Task', 'Notes'], required: true },
  description: { type: String, required: true },
  relatedEntity: { type: String, enum: ['Lead', 'Contact', 'Deal'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
