export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  category?: string;
  is_pinned?: boolean;
}
