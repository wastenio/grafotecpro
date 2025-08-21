// src/types.ts

export interface Document {
  id: number;
  file: string;
  description?: string;
  uploaded_at: string;
  annotations?: string[];
}

export interface Case {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  documents?: Document[];
  final_report?: string;
}

export interface Analysis {
  id: number;
  title: string;
  description: string;
  status: string;
  case: number;
  perito: number;
  observation: string;
  methodology?: string;
  conclusion?: string;
  ai_results?: string;
  document?: string;
  created_at: string; // torne obrigatório
  updated_at: string; // torne obrigatório
}
