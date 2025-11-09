import { QuizData, HistoryItem } from '../types';

let mockHistory: (HistoryItem & { fullQuizData: QuizData })[] = [
  {
    id: 1,
    url: 'https://en.wikipedia.org/wiki/React_(software)',
    title: 'React (software)',
    date_generated: new Date(Date.now() - 86400000).toISOString(),
    fullQuizData: {
      title: "React (software)",
      summary: "React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies.",
      key_entities: ["JavaScript library", "User Interfaces", "Meta", "Components"],
      questions: [
        {
          question_text: "Who maintains React?",
          options: ["Google", "Microsoft", "Meta", "The Apache Foundation"],
          correct_answer: "Meta",
          explanation: "React is primarily maintained by Meta (formerly Facebook), along with a community of individual developers and companies.",
          difficulty: 'easy',
          related_topics: ["Meta", "JavaScript"]
        },
        {
          question_text: "What is JSX?",
          options: ["A templating engine", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
          correct_answer: "A syntax extension for JavaScript",
          explanation: "JSX stands for JavaScript XML. It's a syntax extension that allows you to write HTML-like code in your JavaScript files, making it easier to create and manage UI components.",
          difficulty: 'medium',
          related_topics: ["JSX", "Babel (JavaScript compiler)"]
        },
        {
          question_text: "React applications are built using reusable pieces of code called what?",
          options: ["Functions", "Classes", "Widgets", "Components"],
          correct_answer: "Components",
          explanation: "The core concept of React is building user interfaces out of isolated, reusable pieces of code called components. These components can be composed to create complex UIs.",
          difficulty: 'easy',
          related_topics: ["React component", "Web component"]
        }
      ]
    }
  }
];
let nextId = 2;

const createMockQuiz = (url: string): QuizData => {
  const urlTitle = url.split('/').pop()?.replace(/_/g, ' ') || 'New Topic';
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
  return {
    title: urlTitle,
    summary: `This is a generated summary for the Wikipedia article on ${urlTitle}. It covers the main points and provides a concise overview of the topic.`,
    key_entities: ["Key Entity 1", "Key Entity 2", "Key Entity 3"],
    questions: Array.from({ length: 5 }, (_, i) => ({
      question_text: `What is question number ${i + 1} about ${urlTitle}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct_answer: "Option B",
      explanation: `This is a detailed explanation for why 'Correct Answer' is the right choice for question number ${i + 1}.`,
      difficulty: difficulties[i % 3],
      related_topics: [`${urlTitle} Subtopic ${i*2 + 1}`, `${urlTitle} Subtopic ${i*2 + 2}`]
    }))
  };
};

export const generateQuiz = (url: string): Promise<QuizData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newQuizData = createMockQuiz(url);
      const newHistoryItem = {
        id: nextId++,
        url: url,
        title: newQuizData.title,
        date_generated: new Date().toISOString(),
        fullQuizData: newQuizData
      };
      mockHistory.unshift(newHistoryItem);
      resolve(newQuizData);
    }, 3000);
  });
};

export const getHistory = (): Promise<HistoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHistory.map(({ id, url, title, date_generated }) => ({ id, url, title, date_generated })));
    }, 500);
  });
};

export const getQuizById = (id: number): Promise<QuizData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = mockHistory.find(h => h.id === id);
      resolve(item ? item.fullQuizData : null);
    }, 500);
  });
};