const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.checkThreadById(newReply.threads_id);
    await this._commentRepository.checkCommentById(newReply.comments_id);
    return this._replyRepository.addReply(newReply);
  }
}
module.exports = AddReplyUseCase;
