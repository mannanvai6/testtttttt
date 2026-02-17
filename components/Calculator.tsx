
import React, { useState, useEffect } from 'react';
import { CalculatorMode } from '../types';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [hasError, setHasError] = useState(false);

  const handleKeyPress = (key: string) => {
    if (hasError) {
      handleClear();
      setHasError(false);
    }

    if (/[0-9]/.test(key)) {
      setDisplay(prev => (prev === '0' ? key : prev + key));
    } else if (key === '.') {
      if (!display.includes('.')) {
        setDisplay(prev => prev + '.');
      }
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
      setExpression(display + ' ' + key + ' ');
      setDisplay('0');
    } else if (key === '=') {
      calculateResult();
    }
  };

  const calculateResult = () => {
    try {
      const fullExpression = expression + display;
      // Using Function constructor for calculation as a simple sandbox, 
      // replace * with * and / with / to be safe, but eval/Function is fine for basic calc.
      const sanitized = fullExpression.replace(/[^-0-9+*/().%]/g, '');
      const result = new Function(`return ${sanitized}`)();
      
      const resultStr = String(Number(result).toLocaleString('en-US', { maximumFractionDigits: 10 }));
      onCalculate(fullExpression, resultStr);
      setDisplay(resultStr);
      setExpression('');
    } catch (e) {
      setDisplay('Error');
      setHasError(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setHasError(false);
  };

  const handleBackspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleScientific = (op: string) => {
    let val = parseFloat(display);
    let result: number;

    switch (op) {
      case 'sin': result = Math.sin(val); break;
      case 'cos': result = Math.cos(val); break;
      case 'tan': result = Math.tan(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'log': result = Math.log10(val); break;
      case 'exp': result = Math.exp(val); break;
      case 'pow2': result = Math.pow(val, 2); break;
      default: return;
    }

    const resStr = result.toFixed(10).replace(/\.?0+$/, "");
    onCalculate(`${op}(${display})`, resStr);
    setDisplay(resStr);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleKeyPress(e.key);
      if (['+', '-', '*', '/', '%'].includes(e.key)) handleKeyPress(e.key);
      if (e.key === 'Enter') handleKeyPress('=');
      if (e.key === '.') handleKeyPress('.');
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression]);

  const Button = ({ label, onClick, className = '', variant = 'default' }: any) => {
    const variants: Record<string, string> = {
      default: 'bg-slate-800/50 hover:bg-slate-700/60 text-slate-200',
      operator: 'bg-blue-600/80 hover:bg-blue-500 text-white',
      special: 'bg-slate-700/80 hover:bg-slate-600/80 text-blue-400 font-bold',
      danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
    };

    return (
      <button
        onClick={onClick}
        className={`h-16 rounded-2xl flex items-center justify-center text-xl transition-all active:scale-95 border border-white/5 ${variants[variant]} ${className}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="glass rounded-[2.5rem] p-6 w-full max-w-[420px] shadow-3xl animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header Tabs */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl mb-6 border border-white/5">
        <button 
          onClick={() => setMode('basic')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === 'basic' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Basic
        </button>
        <button 
          onClick={() => setMode('scientific')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${mode === 'scientific' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Scientific
        </button>
      </div>

      {/* Display Screen */}
      <div className="bg-slate-900/40 rounded-3xl p-6 mb-6 min-h-[140px] flex flex-col justify-end items-end overflow-hidden border border-white/5">
        <div className="text-slate-500 text-lg jetbrains-mono truncate w-full text-right h-8">
          {expression}
        </div>
        <div className={`text-5xl font-light jetbrains-mono break-all text-right mt-2 transition-all ${hasError ? 'text-red-400' : 'text-white'}`}>
          {display}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3">
        {mode === 'scientific' ? (
          <>
            <Button label="sin" onClick={() => handleScientific('sin')} variant="special" />
            <Button label="cos" onClick={() => handleScientific('cos')} variant="special" />
            <Button label="tan" onClick={() => handleScientific('tan')} variant="special" />
            <Button label="√" onClick={() => handleScientific('sqrt')} variant="special" />
            
            <Button label="log" onClick={() => handleScientific('log')} variant="special" />
            <Button label="eˣ" onClick={() => handleScientific('exp')} variant="special" />
            <Button label="x²" onClick={() => handleScientific('pow2')} variant="special" />
            <Button label="%" onClick={() => handleKeyPress('%')} variant="special" />
          </>
        ) : (
          <>
            <Button label="AC" onClick={handleClear} variant="danger" />
            <Button label="⌫" onClick={handleBackspace} variant="special" />
            <Button label="%" onClick={() => handleKeyPress('%')} variant="special" />
            <Button label="÷" onClick={() => handleKeyPress('/')} variant="operator" />
          </>
        )}

        {/* Numbers & Standard Operators */}
        <Button label="7" onClick={() => handleKeyPress('7')} />
        <Button label="8" onClick={() => handleKeyPress('8')} />
        <Button label="9" onClick={() => handleKeyPress('9')} />
        <Button label="×" onClick={() => handleKeyPress('*')} variant="operator" />

        <Button label="4" onClick={() => handleKeyPress('4')} />
        <Button label="5" onClick={() => handleKeyPress('5')} />
        <Button label="6" onClick={() => handleKeyPress('6')} />
        <Button label="−" onClick={() => handleKeyPress('-')} variant="operator" />

        <Button label="1" onClick={() => handleKeyPress('1')} />
        <Button label="2" onClick={() => handleKeyPress('2')} />
        <Button label="3" onClick={() => handleKeyPress('3')} />
        <Button label="+" onClick={() => handleKeyPress('+')} variant="operator" />

        <Button label="0" onClick={() => handleKeyPress('0')} className="col-span-2" />
        <Button label="." onClick={() => handleKeyPress('.')} />
        <Button label="=" onClick={() => calculateResult()} variant="operator" className="!bg-blue-500 shadow-blue-500/20 shadow-lg" />
      </div>
    </div>
  );
};

export default Calculator;
