
import React, { useState, useEffect, useCallback } from 'react';
import Calculator from './components/Calculator';
import History from './components/History';
import GeminiAssistant from './components/GeminiAssistant';
import { Calculation } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const addHistoryItem = useCallback((expression: string, result: string) => {
    const newItem: Calculation = {
      id: crypto.randomUUID(),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Sidebar - History (Desktop) */}
        <div className={`lg:col-span-3 h-full hidden lg:block`}>
          <div className="glass rounded-3xl p-6 h-[700px] flex flex-col shadow-2xl overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-slate-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </h2>
            <History history={history} onClear={clearHistory} onSelect={(item) => {/* Can implement auto-fill logic here */}} />
          </div>
        </div>

        {/* Main Calculator */}
        <div className="lg:col-span-6 flex justify-center">
          <Calculator onCalculate={addHistoryItem} />
        </div>

        {/* Right Sidebar - AI Assistant (Desktop) */}
        <div className={`lg:col-span-3 h-full hidden lg:block`}>
          <div className="glass rounded-3xl p-6 h-[700px] flex flex-col shadow-2xl overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-slate-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Assistant
            </h2>
            <GeminiAssistant />
          </div>
        </div>

        {/* Mobile Controls (Floating Buttons) */}
        <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-4 z-50">
           <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-700 active:scale-95 transition-transform"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border border-blue-500 active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>

        {/* Mobile Modals */}
        {isHistoryOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-dark w-full max-w-md rounded-3xl p-6 max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">History</h2>
                  <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
               </div>
               <History history={history} onClear={clearHistory} onSelect={() => setIsHistoryOpen(false)} />
            </div>
          </div>
        )}

        {isAssistantOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-dark w-full max-w-md rounded-3xl p-6 max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">AI Assistant</h2>
                  <button onClick={() => setIsAssistantOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
               </div>
               <GeminiAssistant />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
