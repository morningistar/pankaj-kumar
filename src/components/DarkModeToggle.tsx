interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export function DarkModeToggle({ darkMode, setDarkMode }: DarkModeToggleProps) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="text-xl">
        {darkMode ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
