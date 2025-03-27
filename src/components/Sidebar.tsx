import React from 'react';
import { FileText, Plus, LogOut } from 'lucide-react';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  selectedNote: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNote,
  onSelectNote,
  onNewNote,
  onSignOut
}) => {
  return (
    <div className="w-64 h-screen bg-gray-900/95 backdrop-blur-md border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Notes</h1>
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
            onClick={() => onSelectNote(note.id)}
            className={`p-3 cursor-pointer flex items-center space-x-2 hover:bg-gray-800 transition-colors ${
              selectedNote === note.id ? 'bg-gray-800' : ''
            }`}
          >
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 truncate">{note.title || 'Untitled'}</span>
          </div>
        ))}
      </div>
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