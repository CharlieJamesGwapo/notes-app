"use server";

import prisma from "@/lib/db";

export async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return notes;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}

export async function createNote(title: string = "Untitled") {
  try {
    const note = await prisma.note.create({
      data: { title, content: "" },
    });
    return note;
  } catch (error) {
    console.error("Failed to create note:", error);
    return null;
  }
}

export async function updateNote(id: string, title: string, content: string) {
  try {
    const note = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    return note;
  } catch (error) {
    console.error("Failed to update note:", error);
    return null;
  }
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error("Failed to delete note:", error);
    return false;
  }
}
