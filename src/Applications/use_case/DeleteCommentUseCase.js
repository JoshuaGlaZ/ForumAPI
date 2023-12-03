class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, owner, threads_id } = useCasePayload;
    await this._threadRepository.checkThreadById(threads_id);
    await this._commentRepository.checkCommentById(id);
    await this._commentRepository.checkCommentOwner(id, owner);
    await this._commentRepository.deleteCommentById(id);
  }
}
module.exports = DeleteCommentUseCase;
