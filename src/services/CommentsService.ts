import { Comment } from '../types/entities/Comment';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';

export class CommentsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async getCommentsByPostId(postId: string): Promise<IResBody> {
    const comments: Comment[] = [];
    const commentsQuerySnapshot = await this.db.comments.where('postId', '==', postId).get();

    for (const doc of commentsQuerySnapshot.docs) {
      const data = doc.data();
      comments.push({
        id: doc.id,
        content: data.content,
        postId: data.postId,
        createdBy: data.createdBy,
        createdAt: (data.createdAt as Timestamp)?.toDate(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Comments retrieved successfully!',
      data: comments
    };
  }

  async getCommentById(commentId: string): Promise<IResBody> {
    const commentDoc = await this.db.comments.doc(commentId).get();
    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }
    const data = commentDoc.data() as Comment;
    const comment: Comment = {
      id: commentDoc.id,
      content: data.content,
      postId: data.postId,
      createdBy: data.createdBy,
      createdAt: (data.createdAt as Timestamp)?.toDate(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    };

    return {
      status: 200,
      message: 'Comment retrieved successfully!',
      data: comment
    };
  }

  async addCommentToPost(commentData: Comment): Promise<IResBody> {
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Comment added successfully!',
    };
  }

  async updateComment(commentId: string, commentData: Partial<Comment>): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    await commentRef.update({
      ...commentData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Comment updated successfully!',
    };
  }

  async deleteComment(commentId: string): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    await commentRef.delete();

    return {
      status: 200,
      message: 'Comment deleted successfully!',
    };
  }
  async voteComment(commentId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<IResBody> {
    const commentRef = this.db.comments.doc(commentId);
    const commentDoc = await commentRef.get();

    if (!commentDoc.exists) {
      return {
        status: 404,
        message: 'Comment not found',
      };
    }

    const commentData = commentDoc.data() as Comment;
    const voteChange = voteType === 'upvote' ? 1 : -1;

    await commentRef.update({
      votes: (commentData.votes || 0) + voteChange,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: `Comment ${voteType}d successfully!`,
    };
  }
}

