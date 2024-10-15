// React
import { useState } from "react";

// Third party components
import { TextSearchIcon } from "lucide-react";
import { Input } from "~/components/ui/input";

export const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);

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
        className="pl-10 w-full h-full pr-10 focus:border-gray-400 focus:ring-gray-300"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
