/* eslint-disable camelcase */
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threads_id } = request.params;
    const addedComment = await addCommentUseCase.execute({ content, owner, threads_id });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { id, threads_id } = request.params;
    await deleteCommentUseCase.execute({ id, owner, threads_id });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}
module.exports = CommentsHandler;
