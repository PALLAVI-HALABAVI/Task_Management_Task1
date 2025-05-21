const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meetingLink: { type: String, required: true },
  meetingTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
