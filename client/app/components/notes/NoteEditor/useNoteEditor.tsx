// React
import { useState } from "react";

// Tiptap
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// Third party components
import { Button } from "~/components/ui/button";

const EDITOR_MIN_HEIGHT = 500;

export default function useNoteEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange?: (markdown: string) => void;
}) {
  const [editorHeight, setEditorHeight] = useState(EDITOR_MIN_HEIGHT);

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

  return {
    editor,
    editorHeight,
    MenuButton,
    handleResize,
  };
}
