import React, { useEffect, useState } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from './firebase';
import { useAuth } from './contexts/AuthContext';
import { Note } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import ShareDialog from './components/ShareDialog';
import { encryptContent, decryptContent } from './utils/encryption';
import { FileText } from 'lucide-react';
import { findUserByEmail } from './utils/users';

function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const notesRef = ref(database, `notes/${user.uid}`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const decryptedNotes = Object.entries(data).map(([id, note]: [string, any]) => ({
        ...note,
        id,
        content: decryptContent(note.content, user.uid)
      }));

      setNotes(decryptedNotes);
    });

    return () => unsubscribe();
  }, [user]);

  const handleNewNote = async () => {
    if (!user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      collaborators: []
    };

    await set(ref(database, `notes/${user.uid}/${newNote.id}`), {
      ...newNote,
      content: encryptContent(newNote.content, user.uid)
    });

    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = async (content: string, title?: string) => {
    if (!user || !selectedNoteId) return;

    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) return;

    const updatedNote = {
      ...note,
      content,
      title: title || note.title,
      updatedAt: Date.now()
    };

    await set(ref(database, `notes/${user.uid}/${selectedNoteId}`), {
      ...updatedNote,
      content: encryptContent(updatedNote.content, user.uid)
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    await remove(ref(database, `notes/${user.uid}/${noteId}`));
    
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  };

  const handleShareNote = async (email: string) => {
    if (!user || !selectedNoteId) return;

    const collaboratorId = await findUserByEmail(email);
    if (!collaboratorId) return;

    const note = notes.find((n) => n.id === selectedNoteId);
    if (!note) return;

    const updatedNote = {
      ...note,
      collaborators: [...(note.collaborators || []), collaboratorId]
    };

    await set(ref(database, `notes/${user.uid}/${selectedNoteId}`), {
      ...updatedNote,
      content: encryptContent(updatedNote.content, user.uid)
    });

    // Share note with collaborator
    await set(ref(database, `shared_notes/${collaboratorId}/${selectedNoteId}`), {
      owner: user.uid,
      noteId: selectedNoteId
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin text-white">
          <FileText className="w-8 h-8" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-6">OSFM Markdown Editor</h1>
          <button
            onClick={() => signInWithGoogle()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        notes={notes}
        selectedNote={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onNewNote={handleNewNote}
        onSignOut={signOut}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10">
          {selectedNoteId && (
            <ShareDialog
              noteId={selectedNoteId}
              onShare={handleShareNote}
            />
          )}
        </div>
        <Editor
          note={notes.find((n) => n.id === selectedNoteId) || null}
          onUpdateNote={handleUpdateNote}
        />
      </div>
    </div>
  );
}

export default App;