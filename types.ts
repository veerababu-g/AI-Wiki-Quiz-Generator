export interface QuizQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  related_topics: string[];
}

export interface QuizData {
  title: string;
  summary: string;
  key_entities: string[];
  questions: QuizQuestion[];
}

export interface HistoryItem {
  id: number;
  url: string;
  title: string;
  date_generated: string;
}
