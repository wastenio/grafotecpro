import * as z from 'zod';

// User
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  is_staff: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

// ForgeryType
export const ForgeryTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
});

export type ForgeryType = z.infer<typeof ForgeryTypeSchema>;

// Case (atualizado com novos campos)
export const CaseSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['open', 'closed', 'pending']).optional(),
  perito: UserSchema.optional(),
  fraudType: ForgeryTypeSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Case = z.infer<typeof CaseSchema>;

// Analysis
export const AnalysisSchema = z.object({
  id: z.number(),
  case: CaseSchema,
  title: z.string().min(1),
  methodology: z.string().optional(),
  conclusion: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

// Quesito
export const QuesitoSchema = z.object({
  id: z.number(),
  case_id: z.number(),
  question: z.string().min(1),
  answer: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Quesito = z.infer<typeof QuesitoSchema>;

// Comparison
export const ComparisonSchema = z.object({
  id: z.number(),
  analysis_id: z.number(),
  similarity_score: z.number().nullable(),
  result: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Comparison = z.infer<typeof ComparisonSchema>;

// Comment (recursivo)
export const CommentSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number(),
    content: z.string().min(1),
    author: UserSchema,
    parent: CommentSchema.optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  })
);

export type Comment = z.infer<typeof CommentSchema>;

// DocumentVersion
export const DocumentVersionSchema = z.object({
  id: z.number(),
  document_id: z.number(),
  version_number: z.number(),
  file_url: z.string().url(),
  changelog: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;
