"use client";

import { useEffect, useState, useTransition } from "react";
import { Note } from "@prisma/client";
import { getNotes, createNote } from "./actions";
import { NotesList } from "./components/NotesList";
import { NoteEditor } from "./components/NoteEditor";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const loadedNotes = await getNotes();
      setNotes(loadedNotes);
      if (loadedNotes.length > 0) {
        setSelectedId(loadedNotes[0].id);
      }
    });
  }, []);

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchTerm(customEvent.detail);
    };
    window.addEventListener("search", handleSearch);
    return () => window.removeEventListener("search", handleSearch);
  }, []);

  const handleNewNote = () => {
    startTransition(async () => {
      const newNote = await createNote("Untitled");
      if (newNote) {
        const updated = await getNotes();
        setNotes(updated);
        setSelectedId(newNote.id);
      }
    });
  };

  const handleNoteDeleted = () => {
    startTransition(async () => {
      const updated = await getNotes();
      setNotes(updated);
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    });
  };

  const handleNoteSaved = () => {
    startTransition(async () => {
      const updated = await getNotes();
      setNotes(updated);
    });
  };

  const selectedNote = notes.find((n) => n.id === selectedId) || null;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <NotesList
        notes={notes}
        selectedId={selectedId}
        searchTerm={searchTerm}
        onSelectNote={setSelectedId}
        onNewNote={handleNewNote}
      />
      <NoteEditor
        note={selectedNote}
        onNoteDeleted={handleNoteDeleted}
        onNoteSaved={handleNoteSaved}
      />
    </div>
  );
}
