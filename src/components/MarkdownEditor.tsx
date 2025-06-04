import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useNotes } from '../contexts/NotesContext';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [renderedContent, setRenderedContent] = useState('');
  const [localUpdatedAt, setLocalUpdatedAt] = useState<number | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Track last saved values to avoid unnecessary updates
  const lastSavedTitle = useRef('');
  const lastSavedContent = useRef('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setLocalUpdatedAt(currentNote.updatedAt || null);
      lastSavedTitle.current = currentNote.title;
      lastSavedContent.current = currentNote.content;
    }
  }, [currentNote]);

  useEffect(() => {
    setRenderedContent(DOMPurify.sanitize(marked.parse(content || '')));
  }, [content]);

  // Autosave only if content or title actually changed
  useEffect(() => {
    if (!currentNote) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    // Only schedule autosave if user has changed something
    if (title !== lastSavedTitle.current || content !== lastSavedContent.current) {
      saveTimeout.current = setTimeout(async () => {
        setIsSaving(true);
        try {
          await updateNote(currentNote.id, { title, content });
          setLocalUpdatedAt(Date.now());
          lastSavedTitle.current = title;
          lastSavedContent.current = content;
        } catch (error) {
          console.error('Error autosaving note:', error);
        } finally {
          setIsSaving(false);
        }
      }, 500);
    }

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [title, content, currentNote, updateNote]);

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">No note selected</p>
          <p>Create a new note or select one from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
          placeholder="Note title..."
        />
      </div>

      {/* Editor & Live Preview Side by Side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 h-full border-r border-gray-800 bg-gray-900">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none border-none bg-gray-900 text-white placeholder-gray-400 focus:ring-0 p-4 font-mono"
            placeholder="Start writing your markdown here..."
          />
        </div>
        {/* Live Preview */}
        <div className="w-1/2 h-full overflow-y-auto p-4 bg-gray-900">
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>
            {(content || '').length} characters • {(content || '').split('\n').length} lines
          </span>
          <span>
            Last saved: {localUpdatedAt ? new Date(localUpdatedAt).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
