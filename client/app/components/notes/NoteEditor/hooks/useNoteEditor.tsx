// React
import { useState } from "react";

// First party libraries
import { updateNote } from "~/api/notes";
import { SaveButtonState } from "../types";
import { lowlight } from "../utils";

// Tiptap
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Third party components
import { useToast } from "~/hooks/use-toast";

// First party components
import CodeBlock from "../components/CodeBlock";

const EDITOR_MIN_HEIGHT = 500;

export default function useNoteEditor({
  initialContent,
  onChange,
  noteId,
}: {
  initialContent: string;
  onChange?: (markdown: string) => void;
  noteId?: string;
}) {
  const [editorHeight, setEditorHeight] = useState(EDITOR_MIN_HEIGHT);
  const [saveButtonState, setSaveButtonState] =
    useState<SaveButtonState>("default");
  const { toast } = useToast();

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
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock);
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            language: {
              default: "javascript",
              parseHTML: (element) => element.getAttribute("data-language"),
              renderHTML: (attributes) => ({
                "data-language": attributes.language,
              }),
            },
          };
        },
      }).configure({
        lowlight,
        defaultLanguage: "javascript",
        HTMLAttributes: {
          class: "not-prose relative rounded-md",
        },
      }),
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

  const handleSave = async () => {
    if (!noteId || !editor) {
      toast({
        title: "Error",
        description: "Note ID is required to save changes",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaveButtonState("loading");
      const content = editor.getHTML();
      const updatedNote = await updateNote(noteId, { content });

      if (!updatedNote) {
        throw new Error("Failed to update note");
      }

      setSaveButtonState("success");
      toast({
        title: "Success",
        description: "Note saved successfully",
      });
    } catch (error) {
      console.error(error);
      setSaveButtonState("failure");
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setSaveButtonState("default");
      }, 2000);
    }
  };

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

  return { editor, editorHeight, handleResize, handleSave, saveButtonState };
}
