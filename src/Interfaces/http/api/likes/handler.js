/* eslint-disable camelcase */
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threads_id, comments_id } = request.params;
    await likeCommentUseCase.execute({ threads_id, comments_id, owner });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}
module.exports = LikesHandler;
