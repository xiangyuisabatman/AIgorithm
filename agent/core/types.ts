export interface Problem {
  englishName: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  content: string;
  examples: Example[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
  expected: any;
}

export interface ProblemMeta {
  englishName: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface TestResult {
  passed: boolean;
  failedTestCase?: TestCase;
  executionTime: number;
  memoryUsage: number;
  errorMessage?: string;
}

export interface UserProgress {
  completedProblems: string[];
  currentDifficulty: "Easy" | "Medium" | "Hard";
  totalSolved: number;
  accuracy: number;
}

export interface PracticeSession {
  problems: ProblemMeta[];
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score: number;
}
