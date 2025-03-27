import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Note } from '../types';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (content: string) => void;
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
    <div className="flex-1 flex flex-col bg-gray-900">
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdateNote(note.content, e.target.value)}
        className="px-4 py-2 bg-transparent text-white text-xl font-semibold focus:outline-none border-b border-gray-700"
        placeholder="Untitled"
      />
      <div className="flex-1 p-4">
        <MDEditor
          value={note.content}
          onChange={(value) => onUpdateNote(value || '')}
          preview="edit"
          className="w-full h-full"
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Editor;