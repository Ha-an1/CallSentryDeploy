import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL_CHAT } from "../constants";
import { RiskAnalysis, CallData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// -- Chat Instance --
export const createChatSession = () => {
  return ai.chats.create({
    model: GEMINI_MODEL_CHAT,
    config: {
      systemInstruction: `
        You are "CallSentry", an automated AI call screening assistant. 
        Your goal is to screen incoming calls for a user named "Alex".
        
        Guidelines:
        1. Be polite but professional and slightly guarded.
        2. Ask the caller (the user) for their name and reason for calling if they haven't provided it.
        3. If the caller sounds suspicious (e.g., asking for money, passwords, urgent IRS payments, "grandchild in jail"), ask probing questions to verify identity.
        4. If the caller is a telemarketer, firmly decline.
        5. If the caller is legitimate (e.g., family, doctor, delivery), say you will pass the message along.
        6. Keep responses relatively short, like a real phone conversation.
        
        The user you are chatting with is the "Caller".
      `,
      temperature: 0.7,
    }
  });
};

// -- Risk Analysis --
// We run this in parallel or periodically to update the "Risk Meter"
export const analyzeConversationRisk = async (transcript: string): Promise<RiskAnalysis> => {
  if (!apiKey) {
    return { score: 0, label: 'UNKNOWN', reasoning: 'API Key missing' };
  }

  const prompt = `
    Analyze the following call transcript between "CallSentry" (AI) and a "Caller".
    Determine the likelihood that the Caller is a scammer, spammer, or malicious.
    
    Transcript:
    ${transcript}
    
    Return JSON with:
    - score (0 to 100, where 100 is confirmed scam/danger)
    - label (SAFE, SUSPICIOUS, SCAM)
    - reasoning (brief explanation)
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_CHAT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            label: { type: Type.STRING, enum: ["SAFE", "SUSPICIOUS", "SCAM", "UNKNOWN"] },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as RiskAnalysis;
  } catch (e) {
    console.error("Risk analysis failed", e);
    return { score: 0, label: 'UNKNOWN', reasoning: 'Analysis failed' };
  }
};

// -- Detailed Call Analysis --
export interface GeminiAnalysisResult {
  summary: string;
  rootCause: string;
  recommendation: string;
  complianceCheck: boolean;
}

export const analyzeCallWithGemini = async (call: CallData): Promise<GeminiAnalysisResult> => {
  if (!apiKey) {
    return {
      summary: "API Key missing",
      rootCause: "N/A",
      recommendation: "Check API configuration",
      complianceCheck: false
    };
  }

  const prompt = `
    Analyze this detailed call transcript.
    Agent: ${call.agentId}
    Call ID: ${call.id}
    
    Transcript:
    ${call.transcript.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`).join('\n')}
    
    Provide a structured analysis in JSON:
    - summary: A brief summary of the call.
    - rootCause: The main reason for the call or the root cause of any issue discussed.
    - recommendation: Advice for the agent or next steps.
    - complianceCheck: Boolean, true if the agent followed standard protocols (greeting, verification, politeness), false otherwise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_CHAT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            rootCause: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            complianceCheck: { type: Type.BOOLEAN }
          }
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as GeminiAnalysisResult;
  } catch (e) {
    console.error("Detailed analysis failed", e);
    return {
      summary: "Analysis failed",
      rootCause: "Unknown error",
      recommendation: "Retry analysis",
      complianceCheck: false
    };
  }
};
