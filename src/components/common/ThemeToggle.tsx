import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-full transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 shadow-md ring-1 ring-slate-700'
          : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
      } ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 animate-in spin-in-90 duration-300" />
        ) : (
          <Moon className="w-5 h-5 animate-in spin-in-90 duration-300" />
        )}
      </div>
    </button>
  );
};
