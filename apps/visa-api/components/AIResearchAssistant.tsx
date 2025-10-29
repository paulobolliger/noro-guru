import React, { useState } from 'react';
import { researchTopicWithAI } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface AIResearchAssistantProps {
  countryName: string;
  t: (key: string) => string;
}

export const AIResearchAssistant: React.FC<AIResearchAssistantProps> = ({ countryName, t }) => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await researchTopicWithAI(countryName, topic);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult(t('aiSearchError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2">
      <h3 className="font-bold text-lg mb-4">🤖 {t('aiAssistantTitle')}</h3>
      <p className="text-sm text-slate-600 mb-4">
        {t('aiAssistantDescription')}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('aiAssistantPlaceholder')}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled={isLoading}
        />
        <button
          onClick={handleResearch}
          disabled={isLoading || !topic.trim()}
          className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="w-5 h-5" /> : t('searchButton')}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-2">{t('aiSearchResultTitle')}:</h4>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
};
