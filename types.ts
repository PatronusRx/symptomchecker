// types.ts
export interface Symptom {
  slug: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
}

export interface SymptomDetail {
  options: string[];
  text: string;
  multiSelect?: boolean;
}

export interface SymptomAttribute {
  positive: string;
  negative: string;
  details?: Record<string, SymptomDetail>;
}

// Interface for the generated SOAP note
export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  fullText: string;
}
