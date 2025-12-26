import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure the API key is secured.
// For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askSensei = async (techniqueName: string, discipline: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Sensei AI: Por favor, configure sua chave de API (API_KEY) para receber conselhos sagrados.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Você é um grão-mestre de artes marciais sábio e experiente da academia "Zen Jitsu".
      O aluno está perguntando sobre a técnica: "${techniqueName}" na disciplina de "${discipline}".
      
      Forneça um conselho curto, técnico e motivacional (máximo 100 palavras).
      Inclua:
      1. Um detalhe crucial para a técnica funcionar.
      2. Um erro comum para evitar.
      3. Uma frase filosófica curta no estilo "Bushido" ou "Mestre Miyagi" no final.
      
      Use formatação Markdown simples.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "O Sensei está meditando... tente novamente em breve.";
  } catch (error) {
    console.error("Erro ao consultar o Sensei:", error);
    return "Ocorreu um erro ao comunicar com o espírito do tatame. Verifique sua conexão.";
  }
};