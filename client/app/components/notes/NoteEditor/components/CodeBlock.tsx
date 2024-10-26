// React
import React, { useState } from "react";

// First party libraries
import { LANGUAGES } from "../utils";

// Tiptap
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

// Third party libraries
import { cn } from "~/lib/utils";

// Third party components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const CodeBlockComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [language, setLanguage] = useState(node.attrs.language || "javascript");

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateAttributes({ language: newLanguage });
  };

  return (
    <NodeViewWrapper className="relative not-prose">
      <div className="absolute right-4 top-2 z-10">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-7 w-40 bg-background text-xs">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-xs">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <pre
        className={cn(
          "mt-2 rounded-lg bg-muted px-4 py-4 pt-10",
          "font-mono text-sm",
          "overflow-x-auto"
        )}
      >
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
