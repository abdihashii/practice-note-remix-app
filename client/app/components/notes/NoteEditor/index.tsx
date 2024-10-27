// Tiptap
import { EditorContent } from "@tiptap/react";

// Third party components
import { Save } from "lucide-react";
import { Button } from "~/components/ui/button";

// First party components
import EditorMenu from "./components/EditorMenu";
import useNoteEditor from "./hooks/useNoteEditor";

import "./styles/note-editor.scss";

interface NoteEditorProps {
  initialContent?: string;
  noteId?: string;
  onChange?: (markdown: string) => void;
  onSave?: () => void;
}

const NoteEditor = ({
  initialContent = "",
  noteId,
  onChange,
  onSave,
}: NoteEditorProps) => {
  const { editor, editorHeight, handleResize, handleSave, isSaving } =
    useNoteEditor({
      initialContent,
      onChange,
      noteId,
    });

  if (!editor) {
    return null;
  }

  const onSaveClick = async () => {
    await handleSave();
    onSave?.();
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/30 px-2 py-1">
        <div className="flex-1 overflow-x-auto">
          <EditorMenu editor={editor} />
        </div>

        <div className="ml-2 flex h-full items-center pl-2">
          <Button
            variant="default"
            size="sm"
            onClick={onSaveClick}
            disabled={isSaving}
            className="h-8 gap-1.5 px-3 font-medium"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose dark:prose-invert prose-sm max-w-none overflow-y-auto p-4 focus:outline-none"
        style={{ height: `${editorHeight}px` }}
      />

      <div
        className="h-1.5 cursor-ns-resize bg-muted/50 transition-colors hover:bg-muted/70"
        onMouseDown={handleResize}
      />
    </div>
  );
};

export default NoteEditor;
