import React from 'react';
import { FileText, Plus, LogOut, Wand2, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { enhanceWithAI } from '../utils/ai';

interface SidebarProps {
  notes: Note[];
  selectedNote: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onSignOut: () => void;
  onUpdateNote: (content: string) => void;
  onDeleteNote: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNote,
  onSelectNote,
  onNewNote,
  onSignOut,
  onUpdateNote,
  onDeleteNote
}) => {
  const handleEnhance = async () => {
    if (!selectedNote) return;
    
    const currentNote = notes.find(note => note.id === selectedNote);
    if (!currentNote) return;

    try {
      const enhancedContent = await enhanceWithAI(currentNote.content);
      onUpdateNote(enhancedContent);
    } catch (error) {
      console.error('Failed to enhance note:', error);
      alert('Failed to enhance note. Please try again.');
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-900/95 backdrop-blur-md border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">OSFM Markdown Editor</h1>
        <button
          onClick={onNewNote}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-300" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-3 cursor-pointer flex items-center justify-between group hover:bg-gray-800 transition-colors ${
              selectedNote === note.id ? 'bg-gray-800' : ''
            }`}
          >
            <div 
              className="flex items-center space-x-2 flex-1"
              onClick={() => onSelectNote(note.id)}
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 truncate">{note.title || 'Untitled'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleEnhance}
        disabled={!selectedNote}
        className="p-4 border-t border-gray-700 flex items-center space-x-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 className="w-5 h-5 text-gray-300" />
        <span className="text-gray-300">Enhance with AI (Experimental)</span>
      </button>
      <button
        onClick={onSignOut}
        className="p-4 border-t border-gray-700 flex items-center space-x-2 hover:bg-gray-800 transition-colors"
      >
        <LogOut className="w-5 h-5 text-gray-300" />
        <span className="text-gray-300">Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;