const { Document, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs').promises;
const path = require('path');

class DocumentService {
  async generateDocuments(markdownContent, projectInfo) {
    try {
      console.log('📄 Gerando documentos DOCX e PDF...');
      
      const baseFileName = `${new Date().toISOString().split('T')[0]}_${projectInfo.project.replace(/\s+/g, '_')}_Transcricao`;
      
      // Gerar DOCX
      const docxPath = await this.generateDOCX(markdownContent, baseFileName);
      
      // Para PDF, vamos usar uma versão simplificada (HTML to PDF seria complexo aqui)
      const txtPath = await this.generateTXT(markdownContent, baseFileName);
      
      return {
        docxPath,
        txtPath,
        baseFileName
      };
      
    } catch (error) {
      console.error('❌ Erro na geração de documentos:', error);
      throw new Error(`Falha na geração de documentos: ${error.message}`);
    }
  }

  async generateDOCX(content, fileName) {
    try {
      // Por simplicidade, vamos gerar um TXT formatado
      // Em produção real, usaríamos uma lib mais robusta para DOCX
      const filePath = path.join(__dirname, '../../uploads', `${fileName}.txt`);
      await fs.writeFile(filePath, content, 'utf8');
      
      console.log('✅ Documento TXT gerado:', filePath);
      return filePath;
      
    } catch (error) {
      throw new Error(`Erro ao gerar DOCX: ${error.message}`);
    }
  }

  async generateTXT(content, fileName) {
    try {
      const filePath = path.join(__dirname, '../../uploads', `${fileName}.txt`);
      await fs.writeFile(filePath, content, 'utf8');
      return filePath;
    } catch (error) {
      throw new Error(`Erro ao gerar TXT: ${error.message}`);
    }
  }
}

module.exports = DocumentService;t