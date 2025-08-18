export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface Case {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: number;
  case: Case;
  title: string;
  methodology?: string;
  conclusion?: string;
  created_at: string;
  updated_at: string;
}

export interface Quesito {
  id: number;
  case_id: number;
  question: string;
  answer?: string;
  created_at: string;
  updated_at: string;
}

export interface Comparison {
  id: number;
  analysis_id: number;
  similarity_score?: number;
  result?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  parent?: Comment | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: number;
  document_id: number;
  version_number: number;
  file_url: string;
  changelog?: string;
  created_at: string;
  updated_at: string;
}

export interface ForgeryType {
  id: number;
  name: string;
  description?: string;
}

export interface DocumentVersionBrief {
  id: number;
  file_url: string;
}

export interface ComparisonDetail extends Comparison {
  left_document_version?: DocumentVersionBrief | null;
  right_document_version?: DocumentVersionBrief | null;
}