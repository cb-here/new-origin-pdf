import { X } from "lucide-react";
import React from "react";

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Search({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: SearchProps) {
  const handleClear = () => {
    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(event);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400 transition-colors duration-200 group-focus-within:text-primary">
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-10 pr-12 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-primary focus:bg-white/5 focus:ring-4 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-primary dark:focus:bg-gray-800/50 dark:focus:ring-primary/30 transition-all duration-200 group-focus-within:scale-[1.01] box-border"
      />

      {/* Clear (X) Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}