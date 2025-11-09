import React, { useState } from 'react';
import GenerateQuiz from './components/GenerateQuiz';
import History from './components/History';

type Tab = 'generate' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return <GenerateQuiz />;
      case 'history':
        return <History />;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50
        ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-300 hover:bg-neutral'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <header className="bg-neutral shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">
            AI Wiki Quiz Generator
          </h1>
          <nav className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            <TabButton tab="generate" label="Generate Quiz" />
            <TabButton tab="history" label="History" />
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderTabContent()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Gemini & React</p>
      </footer>
    </div>
  );
};

export default App;
