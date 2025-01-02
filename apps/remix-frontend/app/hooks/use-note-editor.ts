// React
import { useState } from "react";

// Third-party imports
import type { SaveButtonState } from "@notes-app/types";
import { Extension } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Italic from "@tiptap/extension-italic";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useToast } from "~/hooks/use-toast";

// First-party imports
import { createNote, updateNote } from "~/api/notes";
import CodeBlock from "~/components/notes-editor/CodeBlock";
import { lowlight } from "~/lib/lowlight-utils";

const EDITOR_MIN_HEIGHT = 500;

interface UseNoteEditorProps {
  initialContent: string;
  noteId?: string;
  newNote?: boolean;
}

export default function useNoteEditor({
  initialContent,
  noteId,
  newNote = false,
}: UseNoteEditorProps) {
  const [editorHeight, setEditorHeight] = useState(EDITOR_MIN_HEIGHT);
  const [saveButtonState, setSaveButtonState] =
    useState<SaveButtonState>("default");
  const { toast } = useToast();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
        bold: false,
        italic: false,
        strike: false,
        code: false,
        blockquote: false,
      }) as Extension,
      Bold,
      Italic,
      Strike,
      Code,
      Blockquote,
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
                "data-language": attributes["language"],
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
    editorProps: {
      attributes: {
        class: "prose-sm focus:outline-none max-w-full",
      },
    },
  });

  const handleUpdateNote = async (title?: string) => {
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
      const updatedNote = await updateNote(noteId, { content, title });

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

  const handleCreateNote = async (title: string) => {
    if (!editor || !title) {
      toast({
        title: "Error",
        description: "Both editor and title are required to create a note",
        variant: "destructive",
      });
      return null;
    }

    try {
      setSaveButtonState("loading");
      const content = editor.getHTML();
      const createdNote = await createNote({ title, content });

      if (!createdNote) {
        throw new Error("Failed to create note");
      }

      setSaveButtonState("success");
      toast({
        title: "Success",
        description: "Note created successfully",
      });

      return createdNote.id; // Return the new note ID
    } catch (error) {
      console.error(error);
      setSaveButtonState("failure");
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
      return null;
    } finally {
      setTimeout(() => {
        setSaveButtonState("default");
      }, 2000);
    }
  };

  const handleSave = async (title?: string) => {
    if (newNote) {
      if (!title) {
        toast({
          title: "Error",
          description: "Title is required for new notes",
          variant: "destructive",
        });
        return null;
      }
      return handleCreateNote(title);
    }
    await handleUpdateNote();
    return noteId;
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

  return {
    editor,
    editorHeight,
    handleResize,
    handleSave,
    saveButtonState,
    handleUpdateNote,
  };
}
