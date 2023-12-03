class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { id, owner, comments_id, threads_id } = useCasePayload;
    await this._threadRepository.checkThreadById(threads_id);
    await this._commentRepository.checkCommentById(comments_id);
    await this._replyRepository.checkReplyById(id);
    await this._replyRepository.checkReplyOwner(id, owner);
    await this._replyRepository.deleteReplyById(id);
  }
}
module.exports = DeleteReplyUseCase;
