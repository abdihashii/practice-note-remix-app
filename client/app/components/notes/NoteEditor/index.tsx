// Tiptap
import { EditorContent } from "@tiptap/react";

// Third party components
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  UndoIcon,
} from "lucide-react";

// First party components
import useNoteEditor from "./useNoteEditor";

import "./styles.css";

interface NoteEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
}

const NoteEditor = ({ initialContent = "", onChange }: NoteEditorProps) => {
  const result = useNoteEditor({ initialContent, onChange });

  if (!result) {
    return null;
  }

  const { editor, editorHeight, MenuButton, handleResize } = result;

  return (
    <div className="flex flex-col w-full border rounded-lg">
      <div className="flex items-center gap-1 p-2 border-b">
        <MenuButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon className="h-4 w-4" />
        </MenuButton>

        <div className="ml-auto flex items-center gap-1">
          <MenuButton onClick={() => editor.chain().focus().undo().run()}>
            <UndoIcon className="h-4 w-4" />
          </MenuButton>

          <MenuButton onClick={() => editor.chain().focus().redo().run()}>
            <RedoIcon className="h-4 w-4" />
          </MenuButton>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-2 overflow-y-auto focus:outline-none"
        style={{ height: `${editorHeight}px` }}
      />

      <div
        className="h-2 bg-gray-200 cursor-ns-resize"
        onMouseDown={handleResize}
      />
    </div>
  );
};

export default NoteEditor;
