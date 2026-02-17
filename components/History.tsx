
import React from 'react';
import { Calculation } from '../types';

interface HistoryProps {
  history: Calculation[];
  onClear: () => void;
  onSelect: (item: Calculation) => void;
}

const History: React.FC<HistoryProps> = ({ history, onClear, onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="text-xs text-slate-500 jetbrains-mono truncate mb-1">
                {item.expression} =
              </div>
              <div className="text-lg font-medium text-slate-200 jetbrains-mono flex justify-between items-center">
                <span>{item.result}</span>
                <span className="text-[10px] text-slate-600 font-sans group-hover:text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {history.length > 0 && (
        <button 
          onClick={onClear}
          className="mt-4 py-3 w-full bg-slate-800/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-2xl text-sm font-medium transition-all"
        >
          Clear History
        </button>
      )}
    </div>
  );
};

export default History;
