const express = require('express');
const multer = require('multer');
const path = require('path');
const transcriptionController = require('../controllers/transcriptionController');

const router = express.Router();

// Configurar multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(mp3|wav|mp4|avi|mov|flac|m4a)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

// Routes
router.post('/create', upload.single('file'), transcriptionController.createTranscription);
router.get('/:id', transcriptionController.getTranscriptionStatus);
router.get('/', transcriptionController.listTranscriptions);

module.exports = router;