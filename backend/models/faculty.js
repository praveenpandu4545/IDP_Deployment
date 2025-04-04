const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  facultyRegd: String,
  branch: String,
  role: { type: String, default: 'faculty' }, // 🔹 Added role
});

module.exports = mongoose.model('Faculty', facultySchema);
