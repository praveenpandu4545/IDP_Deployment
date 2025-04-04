const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  studentRegd: String,
  branch: String,
  year: Number,
  section: String,
  role: { type: String, default: 'student' }, // 🔹 Added role
});

module.exports = mongoose.model('Student', studentSchema);
