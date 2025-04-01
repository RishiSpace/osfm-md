export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  collaborators?: string[];
}

export interface AuthContextType {
  user: any;
  loading: boolean;
}

export interface UserLookupResponse {
  exists: boolean;
  email?: string;
}