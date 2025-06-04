
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MarkdownEditor from './MarkdownEditor';
import { useNotes } from '../contexts/NotesContext';

const EditorLayout: React.FC = () => {
  const { notes, currentNote, createNote, loadNote } = useNotes();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (notes.length > 0 && !currentNote) {
      loadNote(notes[0].id);
    }
  }, [notes, currentNote, loadNote]);

  const handleCreateNote = async () => {
    const noteId = await createNote();
    await loadNote(noteId);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCreateNote={handleCreateNote}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <MarkdownEditor />
      </div>
    </div>
  );
};

export default EditorLayout;
