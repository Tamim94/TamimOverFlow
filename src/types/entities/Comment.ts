import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id?: string;
  voteCount?: number;
  votes?: number;
  content: string;
  postId: string;
  createdBy: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
