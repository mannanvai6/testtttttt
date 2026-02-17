
export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type CalculatorMode = 'basic' | 'scientific';
