require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TRIA Transcription API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando!',
    openai_configured: !!process.env.OPENAI_API_KEY,
    database_url: !!process.env.DATABASE_URL
  });
});

// Basic transcription endpoint (mock for now)
app.post('/api/transcription/create', (req, res) => {
  console.log('Recebido pedido de transcrição:', req.body);
  
  res.json({
    success: true,
    message: 'Transcrição iniciada (modo teste)',
    transcriptionId: 'test-' + Date.now(),
    status: 'PROCESSING'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Algo deu errado!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
    requested_path: req.originalUrl
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TRIA Transcription API rodando na porta ${PORT}`);
  console.log(`📖 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔑 OpenAI configurado: ${!!process.env.OPENAI_API_KEY}`);
});

module.exports = app;