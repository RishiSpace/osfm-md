
import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useNotes } from '../contexts/NotesContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleSave = async () => {
    if (!currentNote) return;

    setIsSaving(true);
    try {
      await updateNote(currentNote.id, { title, content });
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderMarkdown = async (markdown: string) => {
    const html = await marked(markdown);
    return DOMPurify.sanitize(html);
  };

  const [renderedContent, setRenderedContent] = useState('');

  useEffect(() => {
    if (isPreview && content) {
      renderMarkdown(content).then(setRenderedContent);
    }
  }, [content, isPreview]);

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
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant={isPreview ? "default" : "outline"}
            size="sm"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="flex-1 flex">
        {!isPreview ? (
          // Editor Mode
          <div className="w-full">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none border-none bg-gray-900 text-white placeholder-gray-400 focus:ring-0 p-4 font-mono"
              placeholder="Start writing your markdown here..."
            />
          </div>
        ) : (
          // Preview Mode
          <div className="w-full overflow-y-auto p-4 bg-gray-900">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
        <div className="flex justify-between items-center">
          <span>
            {content.length} characters • {content.split('\n').length} lines
          </span>
          <span>
            Last saved: {currentNote.updatedAt ? new Date(currentNote.updatedAt).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
