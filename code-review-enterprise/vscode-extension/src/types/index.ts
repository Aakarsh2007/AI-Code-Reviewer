export interface CodeIssue {
  type: "bug" | "performance" | "style" | "security";
  line: string | number;
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
