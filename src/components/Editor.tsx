import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Note } from '../types';
import { Info, Shield } from 'lucide-react'; // Import the Info and Shield icons

interface EditorProps {
  note: Note | null;
  onUpdateNote: (content: string, title?: string) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
        Select a note or create a new one
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-screen">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdateNote(note.content, e.target.value)}
        className="px-4 py-2 bg-transparent text-white text-xl font-semibold focus:outline-none border-b border-gray-700"
        placeholder="Untitled"
      />
      <div className="flex items-center justify-end px-4 py-2"> {/* Container for icons */}
        <a href="/about" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Info className="w-5 h-5 text-gray-300" />
        </a>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-2">
          <Shield className="w-5 h-5 text-gray-300" />
        </a>
      </div>
      <div className="flex-1 p-4 h-[calc(100vh-56px)]">
        <MDEditor
          value={note.content}
          onChange={(value) => onUpdateNote(value || '')}
          height="100%"
          preview="live"
          className="w-full h-full"
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Editor;