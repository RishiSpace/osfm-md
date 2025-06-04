
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, push, set, onValue, update, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from './AuthContext';
import { NotesContextType, Note, NoteMetadata } from '../types';
import { encryptContent, decryptContent, generateNoteId } from '../utils/encryption';

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setCurrentNote(null);
      return;
    }

    const notesRef = ref(database, `users/${user.uid}/notes`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesList = Object.entries(data).map(([id, noteData]: [string, any]) => ({
          id,
          title: noteData.title || 'Untitled',
          updatedAt: noteData.updatedAt || 0,
          isShared: noteData.isShared || false,
        }));
        notesList.sort((a, b) => b.updatedAt - a.updatedAt);
        setNotes(notesList);
      } else {
        setNotes([]);
      }
    });

    return unsubscribe;
  }, [user]);

  const createNote = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const noteId = generateNoteId();
    const now = Date.now();
    const newNote: Omit<Note, 'id'> = {
      title: 'Untitled Note',
      content: '# New Note\n\nStart writing your markdown here...',
      encryptedContent: encryptContent('# New Note\n\nStart writing your markdown here...'),
      createdAt: now,
      updatedAt: now,
      authorId: user.uid,
      isShared: false,
    };

    const noteRef = ref(database, `users/${user.uid}/notes/${noteId}`);
    await set(noteRef, newNote);

    return noteId;
  };

  const loadNote = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const noteRef = ref(database, `users/${user.uid}/notes/${id}`);
      onValue(noteRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const note: Note = {
            id,
            ...data,
            content: decryptContent(data.encryptedContent),
          };
          setCurrentNote(note);
        }
        setLoading(false);
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error loading note:', error);
      setLoading(false);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {
      ...updates,
      updatedAt: Date.now(),
    };

    if (updates.content) {
      updateData.encryptedContent = encryptContent(updates.content);
      delete updateData.content;
    }

    const noteRef = ref(database, `users/${user.uid}/notes/${id}`);
    await update(noteRef, updateData);
  };

  const deleteNote = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const noteRef = ref(database, `users/${user.uid}/notes/${id}`);
    await remove(noteRef);

    if (currentNote?.id === id) {
      setCurrentNote(null);
    }
  };

  const shareNote = async (id: string, email: string): Promise<void> => {
    // This would implement note sharing logic
    console.log('Sharing note', id, 'with', email);
  };

  const value: NotesContextType = {
    notes,
    currentNote,
    loading,
    createNote,
    loadNote,
    updateNote,
    deleteNote,
    shareNote,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
