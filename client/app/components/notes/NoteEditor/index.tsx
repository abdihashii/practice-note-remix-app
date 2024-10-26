// Tiptap
import { Extension } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { EditorContent } from "@tiptap/react";
import { common, createLowlight } from "lowlight";

// First party components
import EditorMenu from "./EditorMenu";
import useNoteEditor from "./useNoteEditor";

import "./styles/note-editor.scss";

// Create lowlight instance with ALL common languages
const lowlight = createLowlight(common);

interface NoteEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
}

const NoteEditor = ({ initialContent = "", onChange }: NoteEditorProps) => {
  const result = useNoteEditor({
    initialContent,
    onChange,
    customExtensions: [
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
        HTMLAttributes: {
          class: "not-prose relative rounded-md bg-muted",
        },
      }) as Extension,
    ],
  });

  if (!result) {
    return null;
  }

  const { editor, editorHeight, handleResize } = result;

  return (
    <div className="flex flex-col w-full border rounded-lg bg-background">
      <EditorMenu editor={editor} />

      <EditorContent
        editor={editor}
        className="prose dark:prose-invert prose-sm max-w-none px-4 py-2 overflow-y-auto focus:outline-none"
        style={{ height: `${editorHeight}px` }}
      />

      <div
        className="h-2 bg-muted cursor-ns-resize hover:bg-muted/80"
        onMouseDown={handleResize}
      />
    </div>
  );
};

export default NoteEditor;
