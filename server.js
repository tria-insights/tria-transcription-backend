require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// ROTA RAIZ - Para evitar erro 404
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "TRIA Transcription API - Sistema de Transcrição Inteligente",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      test: "/api/test",
      transcription: "/api/transcription"
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: "OK",
    message: "TRIA Transcription API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: "API está funcionando!",
    openai_configured: !!process.env.OPENAI_API_KEY,
    database_url: !!process.env.DATABASE_URL
  });
});

// Transcription routes
app.use('/api/transcription', require('./src/routes/transcription'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({
    success: false,
    error: "Algo deu errado!",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: "Rota não encontrada",
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

// No server.js, adicione este endpoint:
app.get('/api/transcription/status/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Simular busca no banco - você vai conectar com Prisma depois
    const transcription = {
      id,
      status: 'COMPLETED', // PENDING, PROCESSING, COMPLETED, ERROR
      progress: 100,
      result: "# Transcrição Completa...", // Markdown da transcrição
      documents: {
        docx: `/uploads/${id}.docx`,
        pdf: `/uploads/${id}.pdf`
      },
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    
    res.json(transcription);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar status',
      details: error.message
    });
  }
});
