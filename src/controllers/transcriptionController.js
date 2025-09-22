const OpenAIService = require('../services/openaiService');
const DocumentService = require('../services/documentService');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();
const openaiService = new OpenAIService();
const documentService = new DocumentService();

class TranscriptionController {
  async createTranscription(req, res) {
    try {
      console.log('📝 Nova solicitação de transcrição recebida');
      console.log('Body:', req.body);
      console.log('File:', req.file ? req.file.filename : 'Nenhum arquivo');

      const { client, project, year = 2025, file_info } = req.body;
      
      if (!client || !project) {
        return res.status(400).json({
          success: false,
          error: 'Cliente e projeto são obrigatórios'
        });
      }

      // Simular criação de transcrição (sem arquivo real por enquanto)
      const transcriptionId = `transcription_${Date.now()}`;
      
      // Processar em background (simulado)
      setTimeout(() => {
        this.processTranscriptionMock(transcriptionId, { client, project, year, file_info });
      }, 1000);

      res.json({
        success: true,
        message: 'Transcrição iniciada com sucesso',
        transcriptionId,
        status: 'PROCESSING',
        estimatedTime: '5-10 minutos'
      });

    } catch (error) {
      console.error('❌ Erro ao criar transcrição:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async processTranscriptionMock(transcriptionId, projectInfo) {
    try {
      console.log(`🔄 Processando transcrição ${transcriptionId}`);
      
      // Simular processamento com OpenAI
      const mockTranscriptionResult = {
        text: "Esta é uma transcrição simulada de exemplo. Speaker 1 está falando sobre o projeto. Speaker 2 está respondendo e dando feedback. A reunião durou aproximadamente 10 minutos.",
        segments: [
          {
            start: 0.0,
            end: 5.2,
            text: "Boa tarde, vamos começar nossa reunião sobre o projeto.",
            speaker: "Speaker 1"
          },
          {
            start: 5.3,
            end: 10.8,
            text: "Perfeito, estou ansioso para discutir os próximos passos.",
            speaker: "Speaker 2"
          }
        ],
        duration: 600 // 10 minutos
      };

      // Refinar com GPT-4
      const enhancedTranscription = await openaiService.enhanceTranscription(
        mockTranscriptionResult, 
        projectInfo
      );

      // Gerar documentos
      const documents = await documentService.generateDocuments(
        enhancedTranscription, 
        projectInfo
      );

      console.log('✅ Processamento concluído:', transcriptionId);
      console.log('📄 Documentos gerados:', documents.baseFileName);
      
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
    }
  }

  async getTranscriptionStatus(req, res) {
    try {
      const { id } = req.params;
      
      // Mock response - em produção viria do banco
      const mockStatus = {
        id,
        status: 'COMPLETED',
        progress: 100,
        client: 'Cliente Teste',
        project: 'Projeto Teste',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        results: {
          transcriptText: 'Transcrição concluída com sucesso',
          confidence: 0.95,
          speakersCount: 2,
          wordCount: 150,
          duration: 600
        }
      };

      res.json({
        success: true,
        data: mockStatus
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async listTranscriptions(req, res) {
    try {
      // Mock list - em produção viria do banco
      const mockList = [
        {
          id: 'transcription_1',
          client: 'Cliente A',
          project: 'Projeto Alpha',
          status: 'COMPLETED',
          createdAt: '2025-09-19T10:00:00Z',
          duration: 900
        },
        {
          id: 'transcription_2', 
          client: 'Cliente B',
          project: 'Projeto Beta',
          status: 'PROCESSING',
          createdAt: '2025-09-19T11:30:00Z',
          duration: null
        }
      ];

      res.json({
        success: true,
        data: mockList,
        total: mockList.length
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TranscriptionController();