export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed' | 'deleted';

export type ApiProvider = 'kimi' | 'openai' | 'custom';

export interface ApiConfig {
  id: string;
  provider: ApiProvider;
  apiEndpoint: string;
  model: string;
  isActive: boolean;
  dailyLimitPerTeacher: number;
  monthlyLimitPerTeacher: number;
  hasKey?: boolean;
}

export interface AnalysisDimension {
  label: string;
  value: string;
  description?: string;
}

export interface AnalysisRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  courseIds: string[];
  courseNames: string[];
  examType?: string;
  analysisDimensions: string[];
  customInstruction?: string;
  status: AnalysisStatus;
  analysisResult?: AnalysisResult;
  errorMessage?: string;
  tokensUsed?: number;
  estimatedCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResult {
  title: string;
  summary: {
    totalStudents?: number;
    average?: number;
    highest?: number;
    lowest?: number;
    passRate?: number;
    excellentRate?: number;
    [key: string]: any;
  };
  dimensions: {
    name: string;
    content: string;
    suggestions: string[];
  }[];
  overallSuggestions: string[];
}

export interface AnalysisTemplate {
  id: string;
  templateName: string;
  description?: string;
  analysisDimensions: string[];
  defaultPrompt?: string;
  isGlobal: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisStats {
  todayCount: number;
  monthCount: number;
  dailyLimit: number;
  monthlyLimit: number;
  remainingToday: number;
  remainingMonth: number;
}

export interface AnalysisRequest {
  courseIds: string[];
  courseNames: string[];
  examType?: string;
  analysisDimensions: string[];
  customInstruction?: string;
}
