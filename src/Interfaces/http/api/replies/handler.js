/* eslint-disable camelcase */
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threads_id, comments_id } = request.params;
    const addedReply = await addReplyUseCase.execute({ content, owner, comments_id, threads_id });
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { id, threads_id, comments_id } = request.params;
    await deleteReplyUseCase.execute({ id, owner, comments_id, threads_id });
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}
module.exports = RepliesHandler;
