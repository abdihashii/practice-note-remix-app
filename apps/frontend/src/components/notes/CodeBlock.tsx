"use client";

// React
import React, { useState } from "react";

// Third-party imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

// First-party imports
import { LANGUAGES } from "@/lib/language-utils";

const CodeBlockComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [language, setLanguage] = useState(
    node.attrs["language"] || "javascript"
  );

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateAttributes({ language: newLanguage });
  };

  return (
    <NodeViewWrapper className="not-prose relative">
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
