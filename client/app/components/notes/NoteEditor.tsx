import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  UndoIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface NoteEditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
}

const NoteEditor = ({ initialContent = "", onChange }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getText());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    isActive = false,
    onClick,
    children,
  }: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={`p-2 ${isActive ? "bg-accent" : ""}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );

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
        className="prose prose-sm max-w-none p-6 min-h-[400px] focus:outline-none"
      />

      <style>{`
        .ProseMirror {
          min-height: 400px;
          height: 100%;
        }
        
        .ProseMirror p {
          margin: 0.5em 0;
          line-height: 1.6;
        }

        .ProseMirror > * + * {
          margin-top: 0.75em;
        }

        /* Headings */
        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.4em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.3em;
          margin-bottom: 0.5em;
        }

        /* Lists */
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.25em;
          margin: 0.5em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
          line-height: 1.6;
        }

        .ProseMirror ul li {
          list-style-type: disc;
        }

        .ProseMirror ol li {
          list-style-type: decimal;
        }

        /* Blockquotes */
        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
        }

        /* Bold and Italic */
        .ProseMirror strong {
          font-weight: 600;
        }

        .ProseMirror em {
          font-style: italic;
        }

        /* Code blocks */
        .ProseMirror pre {
          background: #f3f4f6;
          padding: 0.75em 1em;
          border-radius: 0.375rem;
          font-family: ui-monospace, monospace;
          font-size: 0.875em;
          overflow-x: auto;
        }

        .ProseMirror code {
          font-family: ui-monospace, monospace;
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .ProseMirror:focus {
          outline: none;
        }

        /* Placeholder styling */
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default NoteEditor;
