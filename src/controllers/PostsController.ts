import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';

export class PostsController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  async createPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { title, description, categories } = request.body;

        const postData = {
          title,
          description,
          categories,
          createdBy: request.userId,
        };

        const postResponse = await this.postsService.createPost(postData);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getPosts(request: Request, response: Response): Promise<void> {
    try {
      const postsResponse = await this.postsService.getPosts();

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getPostById(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const postResponse = await this.postsService.getPostById(id);

      response.status(postResponse.status).send({
        ...postResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async updatePost(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const postData = request.body;

      const postResponse = await this.postsService.updatePost(id, postData);

      response.status(postResponse.status).send({
        ...postResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async deletePost(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;

      const postResponse = await this.postsService.deletePost(id);

      response.status(postResponse.status).send({
        ...postResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getPostsByUser(request: Request, response: Response): Promise<void> {
    try {
      const { userId } = request.params;
      const postsResponse = await this.postsService.getPostsByUser(userId);

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getPostsByCategory(request: Request, response: Response): Promise<void> {
    try {
      const { category } = request.query;
      const postsResponse = await this.postsService.getPostsByCategory(category as string);

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }
  async votePost(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const { voteType } = request.body; // 'upvote' or 'downvote'

      if (!request.userId) {
        response.status(400).json({
          status: 400,
          message: 'User ID is required.',
        });
        return;
      }

      const voteResponse = await this.postsService.votePost(id, request.userId, voteType);

      response.status(voteResponse.status).send({
        ...voteResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }
}


