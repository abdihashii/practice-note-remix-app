// Tiptap
import { EditorContent } from "@tiptap/react";

// First party components
import EditorMenu from "./components/EditorMenu";
import useNoteEditor from "./hooks/useNoteEditor";

import "./styles/note-editor.scss";

interface NoteEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
}

const NoteEditor = ({ initialContent = "", onChange }: NoteEditorProps) => {
  const result = useNoteEditor({
    initialContent,
    onChange,
  });

  if (!result) {
    return null;
  }

  const { editor, editorHeight, handleResize } = result;

  return (
    <div className="flex w-full flex-col rounded-lg border bg-background">
      <EditorMenu editor={editor} />

      <EditorContent
        editor={editor}
        className="prose dark:prose-invert prose-sm max-w-none overflow-y-auto px-4 py-2 focus:outline-none"
        style={{ height: `${editorHeight}px` }}
      />

      <div
        className="h-2 cursor-ns-resize bg-muted hover:bg-muted/80"
        onMouseDown={handleResize}
      />
    </div>
  );
};

export default NoteEditor;
