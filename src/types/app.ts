import type { AITriageResult, SupportedLanguage } from '../services/aiTriage';

export type Page = 'landing' | 'ussd' | 'chw' | 'district';
export type Language = SupportedLanguage;
export type RiskResult = AITriageResult & { level: AITriageResult['riskLevel'] };

export interface Patient {
  name: string;
  age: number;
  weeks: number;
  reason: string;
  score: number;
  district: string;
  language?: Language;
  riskLevel?: AITriageResult['riskLevel'];
  createdAt?: string;
}
