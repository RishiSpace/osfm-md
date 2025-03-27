export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthContextType {
  user: any;
  loading: boolean;
}