
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import AuthWrapper from '../components/AuthWrapper';
import EditorLayout from '../components/EditorLayout';

const Index = () => {
  return (
    <AuthProvider>
      <NotesProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <AuthWrapper>
            <EditorLayout />
          </AuthWrapper>
        </div>
      </NotesProvider>
    </AuthProvider>
  );
};

export default Index;
