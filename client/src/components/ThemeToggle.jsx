import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl transition duration-200 flex items-center justify-center ${
        isDark
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

export default ThemeToggle;
