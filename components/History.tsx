import React, { useState, useEffect } from 'react';
import { getHistory, getQuizById } from '../services/apiService';
import { HistoryItem, QuizData } from '../types';
import Modal from './Modal';
import QuizDisplay from './QuizDisplay';
import { LoadingSpinner } from './icons';

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHistory();
        setHistoryItems(data);
      } catch (err) {
        setError('Failed to load history.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewDetails = async (id: number) => {
    try {
      const data = await getQuizById(id);
      if (data) {
        setSelectedQuiz(data);
        setIsModalOpen(true);
      } else {
        setError('Could not find quiz details.');
      }
    } catch (err) {
      setError('Failed to fetch quiz details.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading history...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-error">{error}</p>;
  }

  return (
    <div className="bg-neutral p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Quiz History</h2>
      {historyItems.length === 0 ? (
        <p className="text-gray-400">No quizzes generated yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">URL</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral divide-y divide-gray-700">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell truncate max-w-xs">{item.url}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">{new Date(item.date_generated).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="text-accent hover:text-blue-400 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedQuiz && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <QuizDisplay quizData={selectedQuiz} />
        </Modal>
      )}
    </div>
  );
};

export default History;
