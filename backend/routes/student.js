const express = require('express');
const Student = require('../models/student');
const multer = require('multer');
const path = require('path');
const Certificate = require('../models/Certificate'); 
const router = express.Router();

// Corrected: Route now uses `req.params.email` to match frontend
router.get('/details/:email', async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const student = await Student.findOne({ email });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-details', async (req, res) => {
    try {
      const { email, name, phone, branch, year, section, studentRegd } = req.body;
  
      const updatedStudent = await Student.findOneAndUpdate(
        { email },
        { name, phone, branch, year, section, studentRegd },
        { new: true }
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


  ///////////////////
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    }
  });
  
  // Upload Route
  router.post('/upload-certificate', upload.single('certificate'), async (req, res) => {
    try {
      console.log('Request File:', req.file); // Debugging: Log req.file
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const { name, studentRegd, year, eventName,
        eventDate, phone, category, studentEmail } = req.body;
  
      // Find student by registration number
      const student = await Student.findOne({ studentRegd });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Ensure `filePath` is assigned correctly
      const filePath = req.file.path; // Verify if this exists
  
      // Store in MongoDB with correct file path
      const newCertificate = new Certificate({
        studentId: student._id,
        name,
        studentRegd,
        year,
        eventName,
        eventDate,
        phone,
        category,
        studentEmail,
        fileUrl: `/uploads/${req.file.filename}`, // Ensure correct path
        filePath: filePath, // Fix filePath
      });
  
      await newCertificate.save();
  
      res.json({ message: 'Certificate uploaded successfully!', filePath });
    } catch (error) {
      console.error('Error uploading certificate:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  ///////////////////
  router.get('/faculty/certificates', async (req, res) => {
    try {
      const certificates = await Certificate.find().populate('studentId', 'name studentRegd year phone studentEmail filePath status');
      res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.delete('/faculty/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete certificate with ID: ${id}`); // ✅ Debugging log

    if (!id) {
      return res.status(400).json({ message: "Certificate ID is required" });
    }

    const deletedCertificate = await Certificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ message: "Error deleting certificate", error: error.message });
  }
});

  ///////////////////////////
  router.get('/certificates/regd/:studentRegd', async (req, res) => {
    try {
      const { studentRegd } = req.params;
      console.log('Fetching certificates for registration number:', studentRegd); // Debugging
  
      const certificates = await Certificate.find({ studentRegd });
  
      console.log('Certificates found:', certificates); // Debugging
  
      if (!certificates.length) {
        return res.status(404).json({ message: 'No certificates found' });
      }
  
      res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.get('/certificates/:email', async (req, res) => {
    try {
      const certificates = await Certificate.find({ studentEmail: req.params.email });
  
      if (!certificates) {
        return res.status(404).json({ message: 'No certificates found' });
      }
  
      res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
 
  router.get('/student/details/:email', async (req, res) => {
    try {
      const student = await Student.findOne({ studentEmail: req.params.email });
  
      if (!student) return res.status(404).json({ message: 'Student not found' });
  
      res.json({
        name: student.name,
        studentRegd: student.studentRegd,
        year: student.year,
        phone: student.phone,
        studentEmail: student.studentEmail
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student details' });
    }
  });
  

module.exports = router;
