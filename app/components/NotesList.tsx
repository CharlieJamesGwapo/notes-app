"use client";

import { Note } from "@prisma/client";

interface NotesListProps {
  notes: Note[];
  selectedId: string | null;
  searchTerm: string;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
}

export function NotesList({
  notes,
  selectedId,
  searchTerm,
  onSelectNote,
  onNewNote,
}: NotesListProps) {
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Notes
        </h1>
        <button
          onClick={onNewNote}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          + New Note
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search notes..."
          defaultValue={searchTerm}
          onChange={(e) => {
            const event = new CustomEvent("search", { detail: e.target.value });
            window.dispatchEvent(event);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notes found
          </div>
        ) : (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                selectedId === note.id
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {note.title || "Untitled"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {note.content || "No content"}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
