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

  async generateDOCX(markdownContent, baseFileName) {
    try {
      const outputDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(outputDir, `${baseFileName}.docx`);
      
      // Converter markdown para DOCX (versão simplificada)
      const paragraphs = this.parseMarkdownToParagraphs(markdownContent);
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });
      
      const buffer = await doc.save();
      await fs.writeFile(filePath, buffer);
      
      console.log('✅ DOCX gerado:', filePath);
      return filePath;
    } catch (error) {
      throw new Error(`Erro ao gerar DOCX: ${error.message}`);
    }
  }

  async generateTXT(markdownContent, baseFileName) {
    try {
      const outputDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(outputDir, `${baseFileName}.txt`);
      
      // Remover markdown e manter apenas texto
      const plainText = markdownContent
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/- /g, '• '); // Convert lists
      
      await fs.writeFile(filePath, plainText, 'utf8');
      
      console.log('✅ TXT gerado:', filePath);
      return filePath;
    } catch (error) {
      throw new Error(`Erro ao gerar TXT: ${error.message}`);
    }
  }

  parseMarkdownToParagraphs(markdown) {
    const lines = markdown.split('\n');
    const paragraphs = [];
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      if (line.startsWith('# ')) {
        // H1
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(line.replace('# ', ''))]
        }));
      } else if (line.startsWith('## ')) {
        // H2
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun(line.replace('## ', ''))]
        }));
      } else if (line.startsWith('### ')) {
        // H3
        paragraphs.push(new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [new TextRun(line.replace('### ', ''))]
        }));
      } else {
        // Parágrafo normal
        const textRuns = this.parseInlineFormatting(line);
        paragraphs.push(new Paragraph({
          children: textRuns
        }));
      }
    }
    
    return paragraphs;
  }

  parseInlineFormatting(text) {
    const runs = [];
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    
    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold
        runs.push(new TextRun({
          text: part.slice(2, -2),
          bold: true
        }));
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic
        runs.push(new TextRun({
          text: part.slice(1, -1),
          italics: true
        }));
      } else {
        // Normal text
        runs.push(new TextRun(part));
      }
    }
    
    return runs;
  }
}

module.exports = DocumentService;
