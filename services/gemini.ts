import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Você é um assistente de prototipação especializado em organizar processos para pequenas agências criativas.
Sua missão é padronizar workflows, criar checklists de assets e gerar automações (Google Apps Script).

REGRAS DE COMPORTAMENTO:
1. Seja direto, profissional e prático.
2. Identifique a intenção do usuário: criar workflow, criar checklist, gerar script ou apenas conversar.
3. Sempre gere uma estrutura de dados válida quando o usuário solicitar uma ação (workflow, checklist, script).
4. Se o usuário pedir "integração", "pastas" ou "automação", gere um Google Apps Script.
5. Mantenha as respostas em Português do Brasil.
`;

// Schema for structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    actionType: {
      type: Type.STRING,
      enum: ['CREATE_WORKFLOW', 'CREATE_CHECKLIST', 'GENERATE_SCRIPT', 'CHAT', 'NAVIGATE'],
      description: "The type of action to perform based on user intent."
    },
    summary: {
      type: Type.STRING,
      description: "A short summary of the action taken or the text response to the user."
    },
    workflowData: {
      type: Type.OBJECT,
      description: "Data if action is CREATE_WORKFLOW",
      properties: {
        title: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['campaign', 'website', 'branding', 'social', 'other'] },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING, enum: ['todo', 'in_progress', 'done'] },
              assignee: { type: Type.STRING }
            }
          }
        }
      }
    },
    checklistData: {
      type: Type.ARRAY,
      description: "Data if action is CREATE_CHECKLIST",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          required: { type: Type.BOOLEAN },
          checked: { type: Type.BOOLEAN },
          category: { type: Type.STRING }
        }
      }
    },
    scriptData: {
      type: Type.OBJECT,
      description: "Data if action is GENERATE_SCRIPT",
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        code: { type: Type.STRING },
        instructions: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    }
  }
};

export const sendMessageToGemini = async (userMessage: string, history: string[]) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Histórico recente: ${history.slice(-3).join('\n')}
      
      Solicitação do usuário: "${userMessage}"
      
      Analise a solicitação e determine a melhor ação. Retorne o JSON estruturado conforme o schema.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more deterministic structural outputs
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      actionType: 'CHAT',
      summary: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, verifique sua chave de API e tente novamente."
    };
  }
};
