export type Sender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export interface RiskAnalysis {
  score: number; // 0-100
  label: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'UNKNOWN';
  reasoning: string;
}

// Payload structure for the backend server
export interface ServerLogPayload {
  conversationId: string;
  messages: ChatMessage[];
  finalRiskAnalysis: RiskAnalysis;
  timestamp: string;
}

// -- Dashboard Types --

export enum CallStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  FLAGGED = 'Flagged'
}

export enum AnomalySeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: AnomalySeverity;
  confidence: number;
}

export interface TranscriptLine {
  speaker: string;
  text: string;
  timestamp: string;
}

export interface CallData {
  id: string;
  agentId: string;
  startTime: string;
  duration: number; // in seconds
  status: CallStatus;
  riskScore: number;
  sentimentScore: number;
  anomalies: Anomaly[];
  transcript: TranscriptLine[];
}
