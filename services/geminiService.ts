import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure the API key is secured.
// For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askSensei = async (
  techniqueName: string, 
  discipline: string, 
  progressPct: number, 
  uncompletedTechniques: string[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Sensei AI: Por favor, configure sua chave de API (API_KEY) para receber conselhos sagrados.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Lista formatada para o prompt
    const suggestionsList = uncompletedTechniques.length > 0 
      ? uncompletedTechniques.join(', ') 
      : "todas as técnicas deste nível (sugira algo avançado)";

    const prompt = `
      Você é o Mestre Zen, um instrutor sábio e técnico da academia "Zen Jitsu".
      
      CONTEXTO DO ALUNO:
      - Disciplina: ${discipline}
      - Progresso Atual no Nível: ${progressPct}% concluído.
      - Técnica de Interesse: "${techniqueName}".
      - Técnicas AINDA NÃO CONCLUÍDAS (Lacunas): ${suggestionsList}.

      SUA MISSÃO:
      1. Explique brevemente a técnica "${techniqueName}" (detalhe crucial + erro comum).
      2. Verifique se esta técnica é adequada considerando que o aluno completou ${progressPct}% do nível.
      3. IMPORTANTE: Sugira UMA técnica da lista de "Técnicas AINDA NÃO CONCLUÍDAS" acima como o próximo passo lógico para criar um plano de estudo, explicando a conexão entre elas.
      
      Mantenha o tom respeitoso, motivador (estilo Bushido) e use formatação Markdown simples. Máximo de 120 palavras.
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