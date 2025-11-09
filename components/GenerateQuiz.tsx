import React, { useState, useEffect, useRef } from 'react';
import { generateQuiz } from '../services/apiService';
import { QuizData } from '../types';
import QuizDisplay from './QuizDisplay';
import { LoadingSpinner } from './icons';

const GenerateQuiz: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loadingProgress, setLoadingProgress] = useState({ step: 0, message: '' });
  const intervalRef = useRef<number | null>(null);

  const loadingSteps = [
    "Scraping Wikipedia article...",
    "Analyzing content with Gemini AI...",
    "Generating quiz questions...",
    "Finalizing quiz..."
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL.');
      return;
    }
    if (!url.includes('wikipedia.org')) {
      setError('Please enter a valid Wikipedia URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizData(null);
    setLoadingProgress({ step: 0, message: loadingSteps[0] });

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setLoadingProgress(prev => {
        const nextStep = prev.step + 1;
        if (nextStep < loadingSteps.length) {
          return { step: nextStep, message: loadingSteps[nextStep] };
        }
        return prev;
      });
    }, 750);

    try {
      const data = await generateQuiz(url);
      setQuizData(data);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error(err);
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-neutral p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Generate a New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wiki-url" className="block text-sm font-medium text-gray-300 mb-1">
              Wikipedia URL
            </label>
            <input
              id="wiki-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-secondary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <><LoadingSpinner /> Generating...</> : 'Generate Quiz'}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-error">{error}</p>}
      </div>

      {isLoading && (
        <div className="bg-neutral p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
                <LoadingSpinner />
                <p className="ml-3 text-lg text-gray-300">{loadingProgress.message}</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-accent h-2.5 rounded-full transition-all duration-700 ease-linear" 
                    style={{ width: `${((loadingProgress.step + 1) / loadingSteps.length) * 100}%` }}
                ></div>
            </div>
            <p className="mt-2 text-sm text-center text-gray-500">This may take a moment while the AI works its magic.</p>
        </div>
      )}

      {quizData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Generated Quiz</h2>
          <QuizDisplay quizData={quizData} />
        </div>
      )}
    </div>
  );
};

export default GenerateQuiz;