const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  name: { type: String, required: true },
  studentRegd: { type: String, required: true },
  year: { type: String, required: true },
  eventName: { type: String, set: value => value.toLowerCase() },
  eventDate:String,
  phone: { type: String, required: true },
  studentEmail: String, // Ensure this exists
  category: { type: String, required: true },
  filePath: { type: String, required: false },
  //status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  uploadedAt: { type: Date, default: Date.now }
});
CertificateSchema.pre('save', function (next) {
  if (this.eventName) {
    this.eventName = this.eventName.toLowerCase();
  }
  next();
});
module.exports = mongoose.model('Certificate', CertificateSchema);
