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
          padding: 1.5rem;
        }
        
        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror > * + * {
          margin-top: 0.75em;
        }

        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default NoteEditor;
