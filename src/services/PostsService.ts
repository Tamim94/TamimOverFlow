import { Post } from '../types/entities/Post';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';

export class PostsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  async createPost(postData: Post): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getPosts(): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getPostById(postId: string): Promise<IResBody> {
    const postDoc = await this.db.posts.doc(postId).get();
    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }
    const post = postDoc.data() as Post;
    post.id = postDoc.id;
    post.createdAt = (post.createdAt as Timestamp)?.toDate();
    post.updatedAt = (post.updatedAt as Timestamp)?.toDate();

    return {
      status: 200,
      message: 'Post retrieved successfully!',
      data: post
    };
  }

  async updatePost(postId: string, postData: Partial<Post>): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    await postRef.update({
      ...postData,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: 'Post updated successfully!',
    };
  }

  async deletePost(postId: string): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    await postRef.delete();

    return {
      status: 200,
      message: 'Post deleted successfully!',
    };
  }

  async getPostsByUser(userId: string): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.where('createdBy', '==', userId).get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getPostsByCategory(category: string): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.where('categories', 'array-contains', category).get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }
  async votePost(postId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<IResBody> {
    const postRef = this.db.posts.doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }

    const postData = postDoc.data() as Post;
    const voteChange = voteType === 'upvote' ? 1 : -1;

    await postRef.update({
      votes: (postData.votes || 0) + voteChange,
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 200,
      message: `Post ${voteType}d successfully!`,
    };
  }
}
