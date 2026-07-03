"use client";

import { Note } from "@prisma/client";
import { useTransition } from "react";
import { updateNote, deleteNote } from "@/app/actions";

interface NoteEditorProps {
  note: Note | null;
  onNoteDeleted: () => void;
  onNoteSaved: () => void;
}

export function NoteEditor({
  note,
  onNoteDeleted,
  onNoteSaved,
}: NoteEditorProps) {
  const [isPending, startTransition] = useTransition();

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Select a note to edit</p>
      </div>
    );
  }

  const handleSave = (title: string, content: string) => {
    startTransition(async () => {
      await updateNote(note.id, title, content);
      onNoteSaved();
    });
  };

  const handleDelete = () => {
    if (confirm("Delete this note?")) {
      startTransition(async () => {
        await deleteNote(note.id);
        onNoteDeleted();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Editing
        </h2>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
        >
          Delete
        </button>
      </div>

      {/* Editor */}
      <NoteForm note={note} onSave={handleSave} isPending={isPending} />
    </div>
  );
}

interface NoteFormProps {
  note: Note;
  onSave: (title: string, content: string) => void;
  isPending: boolean;
}

function NoteForm({ note, onSave, isPending }: NoteFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        onSave(title, content);
      }}
      className="flex-1 flex flex-col p-4 gap-4"
    >
      <input
        type="text"
        name="title"
        defaultValue={note.title}
        placeholder="Note title..."
        className="text-2xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none"
        disabled={isPending}
      />

      <textarea
        name="content"
        defaultValue={note.content}
        placeholder="Write your note here..."
        className="flex-1 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 outline-none resize-none p-0"
        disabled={isPending}
      />

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
