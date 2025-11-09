import React, { useState } from 'react';
import { QuizData, QuizQuestion } from '../types';
import { ShareIcon, CheckIcon, XIcon, LightbulbIcon } from './icons';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  onSelectAnswer: (questionIndex: number, answer: string) => void;
  selectedAnswer?: string;
  isSubmitted: boolean;
  isCorrect: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, onSelectAnswer, selectedAnswer, isSubmitted, isCorrect }) => {
  const getOptionClasses = (option: string) => {
    let baseClasses = 'p-3 w-full text-left rounded-md transition-colors duration-200 disabled:cursor-not-allowed';

    if (isSubmitted) {
      if (option === question.correct_answer) {
        return `${baseClasses} bg-green-800 text-white`;
      }
      if (option === selectedAnswer) {
        return `${baseClasses} bg-red-800 text-white`;
      }
      return `${baseClasses} bg-gray-700 text-gray-400`;
    }

    if (option === selectedAnswer) {
      return `${baseClasses} bg-secondary text-white ring-2 ring-accent`;
    }

    return `${baseClasses} bg-gray-700 hover:bg-gray-600 text-gray-200`;
  };

  const difficultyColors: { [key in 'easy' | 'medium' | 'hard']: string } = {
    easy: 'bg-green-700 text-green-100',
    medium: 'bg-yellow-700 text-yellow-100',
    hard: 'bg-red-700 text-red-100',
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-lg text-white">Question {index + 1}</h4>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${difficultyColors[question.difficulty]}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
        {isSubmitted && (
          isCorrect ? <CheckIcon /> : <XIcon />
        )}
      </div>
      <p className="mt-2 text-gray-300">{question.question_text}</p>
      <ul className="mt-4 space-y-2">
        {question.options.map((option, i) => (
          <li key={i}>
            <button
              onClick={() => onSelectAnswer(index, option)}
              disabled={isSubmitted}
              className={getOptionClasses(option)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {isSubmitted && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
            <div className="bg-base-100 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-yellow-400 pt-0.5">
                        <LightbulbIcon />
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-200 mb-1">Explanation</h5>
                        <p className="text-gray-300 text-sm">{question.explanation}</p>
                    </div>
                </div>
            </div>
            {question.related_topics && question.related_topics.length > 0 && (
                <div>
                    <h5 className="font-semibold text-gray-200 mb-2">Further Reading</h5>
                    <div className="flex flex-wrap gap-2">
                        {question.related_topics.map((topic, i) => (
                           <a 
                             key={i}
                             href={`https://en.wikipedia.org/wiki/${topic.replace(/ /g, '_')}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="px-2 py-1 bg-gray-700 text-accent text-xs font-medium rounded-full hover:bg-gray-600 transition-colors"
                           >
                                {topic}
                           </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

interface InfoChipProps {
    items: string[];
    title: string;
}

const InfoChips: React.FC<InfoChipProps> = ({ items, title }) => (
    <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
            <span key={index} className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                {item}
            </span>
            ))}
        </div>
    </div>
);


interface QuizDisplayProps {
  quizData: QuizData;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    quizData.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        newScore++;
      }
    });
    setScore(newScore);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setShareStatus(null);
  };

  const handleShare = () => {
    const shareText = `I just took a quiz on "${quizData.title}" and scored ${score}/${quizData.questions.length}! Generated by AI Wiki Quiz Generator.`;
    navigator.clipboard.writeText(shareText).then(() => {
      setShareStatus('Copied to clipboard!');
      setTimeout(() => setShareStatus(null), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setShareStatus('Failed to copy results.');
      setTimeout(() => setShareStatus(null), 3000);
    });
  };

  const getScoreFeedback = () => {
    if (!isSubmitted) return null;
    const percentage = (score / quizData.questions.length) * 100;
    if (percentage >= 80) return "Excellent work! 🏆";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep practicing! You can do it. 💪";
  };

  const allQuestionsAnswered = Object.keys(selectedAnswers).length === quizData.questions.length;

  return (
    <div className="space-y-6">
      <div className="bg-neutral p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-2">{quizData.title}</h2>
        <p className="text-gray-400">{quizData.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-neutral p-6 rounded-lg shadow-lg border border-gray-700">
            <InfoChips items={quizData.key_entities} title="Key Entities" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Quiz Questions</h3>
        
        {isSubmitted && (
          <div className="bg-neutral p-4 rounded-lg shadow-lg border border-gray-700 mb-6 text-center">
            <h4 className="text-2xl font-bold text-white">Quiz Complete!</h4>
            <p className="text-lg text-gray-300 mt-2">
              Your Score: <span className="text-accent font-bold">{score}</span> / {quizData.questions.length}
            </p>
            <p className="text-md text-info mt-2">{getScoreFeedback()}</p>
          </div>
        )}

        <div className="space-y-4">
          {quizData.questions.map((q, i) => {
            const isCorrect = isSubmitted && selectedAnswers[i] === q.correct_answer;
            return (
              <QuestionCard 
                  key={i} 
                  question={q} 
                  index={i} 
                  onSelectAnswer={handleSelectAnswer}
                  selectedAnswer={selectedAnswers[i]}
                  isSubmitted={isSubmitted}
                  isCorrect={isCorrect}
              />
            );
          })}
        </div>

        <div className="mt-6 text-center">
          {isSubmitted ? (
             <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-sm">
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <ShareIcon />
                        Share Results
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-500 text-gray-200 font-semibold rounded-md hover:bg-gray-700 hover:border-gray-600 transition-colors"
                    >
                        Take Quiz Again
                    </button>
                </div>
                {shareStatus && <p className="mt-2 text-sm text-green-400 h-5">{shareStatus}</p>}
             </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-secondary disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;