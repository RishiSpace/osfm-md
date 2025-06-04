import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { enhanceWithAI } from '../utils/enhanceWithAI';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onCreateNote }) => {
  const { user, signOut } = useAuth();
  const { notes, currentNote, loadNote, deleteNote, updateNote, setCurrentNote } = useNotes();
  const [enhancing, setEnhancing] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNoteClick = (noteId: string) => {
    loadNote(noteId);
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleEnhance = async () => {
    if (!currentNote) return;
    setEnhancing(true);
    try {
      const enhanced = await enhanceWithAI(currentNote.content);
      if (enhanced) {
        await updateNote(currentNote.id, { content: enhanced });
        // Immediately update the local currentNote so the UI refreshes
        setCurrentNote({
          ...currentNote,
          content: enhanced,
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      alert('AI enhancement failed.');
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <>
      {/* Toggle Button - now on the right */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white mb-4">OSFM Markdown Editor</h1>
            
            <Button 
              onClick={onCreateNote}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              + New Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentNote?.id === note.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <p className="text-sm opacity-70 mt-1">
                        {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarImage src={user?.photoURL} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.displayName || user?.email}
                </p>
              </div>
            </div>

            {/* Enhance with AI Button - place above Sign Out */}
            <Button
              onClick={handleEnhance}
              disabled={!currentNote || enhancing}
              className="w-full mb-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {enhancing ? 'Enhancing...' : 'Enhance with AI'}
            </Button>

            <Button
              onClick={signOut}
              className="w-full text-blue-900 bg-blue-200 hover:bg-blue-300 border-none"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
