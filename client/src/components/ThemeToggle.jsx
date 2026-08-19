import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-pill btn-pill-outline"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle theme"
      style={{ padding: '8px 14px', borderRadius: '50px' }}
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Dark</span>
        </>
      ) : (
        <>
          <Sun size={16} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Light</span>
        </>
      )}
    </button>
  );
}
