import { Request, Response } from 'express';
import { CommentsService } from '../services';
import { validationResult } from 'express-validator';

export class CommentsController {
  private commentsService: CommentsService;

  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  async getCommentsByPostId(request: Request, response: Response): Promise<void> {
    try {
      const { postId } = request.params;
      const commentsResponse = await this.commentsService.getCommentsByPostId(postId);

      response.status(commentsResponse.status).send({
        ...commentsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getCommentById(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const commentResponse = await this.commentsService.getCommentById(id);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async addCommentToPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { postId } = request.params;
        const { content } = request.body;

        if (!request.userId) {
          response.status(400).json({
            status: 400,
            message: 'User ID is required.',
          });
          return;
        }

        const commentData = {
          content,
          postId,
          createdBy: request.userId as string,
        };

        const commentResponse = await this.commentsService.addCommentToPost(commentData);

        response.status(commentResponse.status).send({
          ...commentResponse,
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

  async updateComment(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;
      const commentData = request.body;

      const commentResponse = await this.commentsService.updateComment(id, commentData);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async deleteComment(request: Request, response: Response): Promise<void> {
    try {
      const { id } = request.params;

      const commentResponse = await this.commentsService.deleteComment(id);

      response.status(commentResponse.status).send({
        ...commentResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }
  async voteComment(request: Request, response: Response): Promise<void> {
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

      const voteResponse = await this.commentsService.voteComment(id, request.userId, voteType);

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
