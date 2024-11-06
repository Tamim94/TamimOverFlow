import { Router } from 'express';
import { CommentsController } from '../controllers';
import { validateCreateComment } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class CommentsRoute {
  private commentsController: CommentsController;

  constructor(commentsController: CommentsController) {
    this.commentsController = commentsController;
  }

  createRouter(): Router {
    const router = Router();

    router.get('/posts/:postId/comments', this.commentsController.getCommentsByPostId.bind(this.commentsController));
    router.get('/comments/:id', this.commentsController.getCommentById.bind(this.commentsController));
    router.post('/posts/:postId/comments', authJwt.verifyToken, validateCreateComment, this.commentsController.addCommentToPost.bind(this.commentsController));
    router.put('/comments/:id', authJwt.verifyToken, authJwt.verifyAdminOrOwner, this.commentsController.updateComment.bind(this.commentsController));
    router.delete('/comments/:id', authJwt.verifyToken, authJwt.verifyAdminOrOwner, this.commentsController.deleteComment.bind(this.commentsController));
    router.post('/comments/:id/vote', authJwt.verifyToken, this.commentsController.voteComment.bind(this.commentsController));
    return router;
  }
}
