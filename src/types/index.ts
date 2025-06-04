
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  encryptedContent: string;
  createdAt: number;
  updatedAt: number;
  authorId: string;
  collaborators?: string[];
  isShared: boolean;
}

export interface NoteMetadata {
  id: string;
  title: string;
  updatedAt: number;
  isShared: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface NotesContextType {
  notes: NoteMetadata[];
  currentNote: Note | null;
  loading: boolean;
  createNote: () => Promise<string>;
  loadNote: (id: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  shareNote: (id: string, email: string) => Promise<void>;
}
