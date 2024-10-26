import { EditorContent } from "@tiptap/react";
import {
  BoldIcon,
  BracesIcon,
  CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MinusSquareIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react";
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

  const Divider = () => <div className="w-px h-6 bg-border" />;

  return (
    <div className="flex flex-col w-full border rounded-lg bg-background">
      <div className="flex items-center gap-1 p-2 border-b overflow-x-auto">
        {/* Text Style Group */}
        <MenuButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Cmd + B)"
        >
          <BoldIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Cmd + I)"
        >
          <ItalicIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <StrikethroughIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <CodeIcon className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Headings Group */}
        <MenuButton
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Lists Group */}
        <MenuButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <ListIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrderedIcon className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Block Elements Group */}
        <MenuButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <QuoteIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <BracesIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <MinusSquareIcon className="h-4 w-4" />
        </MenuButton>

        {/* History Group - Right Aligned */}
        <div className="ml-auto flex items-center gap-1">
          <Divider />
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <UndoIcon className="h-4 w-4" />
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <RedoIcon className="h-4 w-4" />
          </MenuButton>
        </div>
      </div>

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
