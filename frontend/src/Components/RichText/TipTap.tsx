"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToolbarButton = ({ onClick, isActive, children }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm mx-1 ${
      isActive ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
    } hover:bg-blue-500 hover:text-white`}
  >
    {children}
  </button>
);

const Tiptap = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: `<p>${content || "Description..."}</p>`,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-600 rounded-lg p-2 bg-gray-900">
      <div
        className="flex mb-2"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          B
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          I
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          U
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="bg-gray-800 p-3 rounded text-white min-h-[150px] max-h-[500px] overflow-y-auto resize-y"
      />
    </div>
  );
};

export default Tiptap;
