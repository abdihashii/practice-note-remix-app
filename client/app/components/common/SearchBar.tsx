// React
import { useState, useEffect, useRef } from "react";

// Third party components
import { TextSearchIcon } from "lucide-react";
import { Input } from "~/components/ui/input";

interface SearchBarProps {
  isModalOpen?: boolean; // we maybe will use this in the future
}

export const SearchBar = ({ isModalOpen }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "/" && !isModalOpen && !isFocused) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isModalOpen, isFocused]);

  return (
    <div className="w-full relative h-12">
      <TextSearchIcon
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-colors ${
          isFocused ? "text-gray-700" : "text-gray-400"
        }`}
      />
      <Input
        type="text"
        placeholder="Search your notes"
        className="pl-12 w-full h-full pr-10 focus:border-gray-400 focus:ring-gray-300"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        autoFocus
      />
      <div
        className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none h-7 w-7 flex items-center justify-center border border-gray-200 rounded-md transition-colors ${
          isFocused ? "text-gray-700" : "text-gray-400"
        }`}
      >
        /
      </div>
    </div>
  );
};
