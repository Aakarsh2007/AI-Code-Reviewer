export interface CodeIssue {
  type: "bug" | "performance" | "style" | "security";
  line: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface TestCase {
  input: string;
  expected_output: string;
  explanation: string;
}

export interface ReviewResponse {
  code_quality_score: number;
  time_complexity: string;
  space_complexity: string;
  issues: CodeIssue[];
  suggestions: string[];
  test_cases: TestCase[];
  refactored_code: string;
  language: string;
  cached: boolean;
  analysis_duration_ms?: number;
}

export interface HistoryItem {
  id: string;
  language: string;
  original_code: string;
  ai_response: ReviewResponse;
  created_at: string;
}

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "c"
  | "go"
  | "rust"
  | "csharp";

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "csharp", label: "C#" },
];
