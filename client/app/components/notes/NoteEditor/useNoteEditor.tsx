// React
import { useState } from "react";

// Tiptap
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension, ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Third party libraries
import { common, createLowlight } from "lowlight";

// First party components
import CodeBlock from "./CodeBlock";

const lowlight = createLowlight(common);

const EDITOR_MIN_HEIGHT = 500;

export default function useNoteEditor({
  initialContent,
  onChange,
  customExtensions = [],
}: {
  initialContent: string;
  onChange?: (markdown: string) => void;
  customExtensions?: Extension[];
}) {
  const [editorHeight, setEditorHeight] = useState(EDITOR_MIN_HEIGHT);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            language: {
              default: "javascript",
              parseHTML: (element) => element.getAttribute("data-language"),
              renderHTML: (attributes) => ({
                "data-language": attributes.language,
              }),
            },
          };
        },
        addKeyboardShortcuts() {
          return {
            "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
            // Handle backtick + language pattern
            Backspace: () => {
              const { selection, doc } = this.editor.state;
              const pos = selection.$head.pos;
              const before = doc.textBetween(Math.max(0, pos - 20), pos);

              // Check for ```{language} pattern
              const match = before.match(/```(\w+)\s*$/);
              if (match) {
                const language = match[1];
                // Replace the ```language with a code block
                this.editor
                  .chain()
                  .deleteRange({ from: pos - match[0].length, to: pos })
                  .setCodeBlock({ language })
                  .run();
                return true;
              }
              return false;
            },
          };
        },
      }).configure({
        lowlight,
        defaultLanguage: "javascript",
        HTMLAttributes: {
          class: "not-prose relative rounded-md",
        },
      }),
      ...customExtensions,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getText());
    },
    editorProps: {
      attributes: {
        class: "prose-sm focus:outline-none max-w-full",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleResize = (mouseDownEvent: React.MouseEvent) => {
    const startY = mouseDownEvent.clientY;
    const startHeight = editorHeight;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newHeight = startHeight + mouseMoveEvent.clientY - startY;
      setEditorHeight(Math.max(EDITOR_MIN_HEIGHT, newHeight));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return { editor, editorHeight, handleResize };
}
