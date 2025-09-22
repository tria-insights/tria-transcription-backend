const OpenAI = require('openai');
const fs = require('fs');
const FormData = require('form-data');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async transcribeAudio(audioFilePath, options = {}) {
    try {
      console.log('🎤 Iniciando transcrição com Whisper...');
      
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        language: options.language || "pt",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"]
      });

      console.log('✅ Transcrição Whisper concluída');
      return transcription;
      
    } catch (error) {
      console.error('❌ Erro na transcrição Whisper:', error);
      throw new Error(`Falha na transcrição: ${error.message}`);
    }
  }

  async enhanceTranscription(rawTranscription, projectInfo) {
    try {
      console.log('🧠 Refinando transcrição com GPT-4...');
      
      const prompt = `
Como TranscriptorGPT especialista da TRIA, refine esta transcrição seguindo EXATAMENTE o formato padrão:

DADOS DO PROJETO:
- Cliente: ${projectInfo.client}
- Projeto: ${projectInfo.project}
- Ano: ${projectInfo.year}

TRANSCRIÇÃO BRUTA:
${JSON.stringify(rawTranscription, null, 2)}

FORMATE EXATAMENTE ASSIM:

# ${projectInfo.project} - Transcrição

**Metadados do Projeto:**
- Cliente: ${projectInfo.client}
- Projeto: ${projectInfo.project}
- Data da transcrição: ${new Date().toLocaleString('pt-BR')}
- Duração total: [CALCULE DA TRANSCRIÇÃO]
- Número de speakers: [IDENTIFIQUE QUANTOS]
- Qualidade do áudio: [AVALIE: Excelente/Boa/Regular]
- Modelo utilizado: Whisper-1 + GPT-4
- Precisão estimada: [ESTIME %]

---

## 📊 Resumo Executivo
[CRIE RESUMO DE 2-3 PARÁGRAFOS DOS PONTOS PRINCIPAIS]

## 👥 Speakers Identificados
[LISTE CADA SPEAKER COM % DO TEMPO DE FALA]

---

## 🎤 Transcrição Completa

[PARA CADA SEGMENTO, USE]:
### Speaker X - [HH:MM:SS → HH:MM:SS]
[TEXTO REFINADO COM PONTUAÇÃO PROFISSIONAL]

---

## 📊 Análise de Conteúdo

### 🎯 Principais Temas Abordados
1. [TEMA 1]
2. [TEMA 2] 
3. [TEMA 3]

### 📝 Palavras-chave Frequentes
[LISTE AS MAIS RELEVANTES]

### ⏱️ Momentos de Destaque
- [TIMESTAMP] - [DESCRIÇÃO DO MOMENTO]

---

## 📋 Observações Técnicas
- Qualidade do áudio: [OBSERVAÇÕES]
- Desafios encontrados: [SE HOUVER]
- Sugestões para futuras gravações: [RECOMENDAÇÕES]

---
*Documento gerado automaticamente pelo TranscriptorGPT*
*Sistema TRIA - Transcrição Inteligente*
*Processado em: ${new Date().toLocaleString('pt-BR')}*

IMPORTANTE: Mantenha toda a formatação markdown e estrutura exatamente como solicitado.
`;

      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000
      });

      console.log('✅ Refinamento GPT-4 concluído');
      return response.choices[0].message.content;
      
    } catch (error) {
      console.error('❌ Erro no refinamento GPT-4:', error);
      throw new Error(`Falha no refinamento: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;