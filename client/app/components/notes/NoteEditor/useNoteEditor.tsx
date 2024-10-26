// React
import { useState } from "react";

// Tiptap
import Placeholder from "@tiptap/extension-placeholder";
import { Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Third party components
import { Button } from "~/components/ui/button";

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

  const MenuButton = ({
    isActive = false,
    onClick,
    children,
    disabled = false,
    title,
  }: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    title?: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={`p-2 ${isActive ? "bg-primary text-secondary" : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </Button>
  );

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

  return { editor, editorHeight, MenuButton, handleResize };
}
