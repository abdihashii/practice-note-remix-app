// Tiptap
import { EditorContent } from "@tiptap/react";

// First party components
import EditorMenu from "./components/EditorMenu";
import { SaveNoteButton } from "./components/SaveNoteButton";
import useNoteEditor from "./hooks/useNoteEditor";

// Styles
import "./styles/note-editor.scss";

interface NoteEditorProps {
  initialContent?: string;
  noteId?: string;
  newNote?: boolean;
  title?: string;
  onSave?: (noteId?: string) => void;
}

const NoteEditor = ({
  initialContent = "",
  noteId,
  newNote = false,
  title,
  onSave,
}: NoteEditorProps) => {
  const { editor, editorHeight, handleResize, handleSave, saveButtonState } =
    useNoteEditor({
      initialContent,
      noteId,
      newNote,
    });

  if (!editor) {
    return null;
  }

  const onSaveClick = async () => {
    const newNoteId = await handleSave(title);

    if (newNoteId) {
      onSave?.(newNoteId);
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/30 px-2 py-1">
        <div className="flex-1 overflow-x-auto">
          <EditorMenu editor={editor} />
        </div>

        <div className="ml-2 flex h-full items-center pl-2">
          <SaveNoteButton
            saveButtonState={saveButtonState}
            handleSave={onSaveClick}
            newNote={newNote}
          />
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
