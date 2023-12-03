const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/replies/entities/GetReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

/* eslint-disable quotes */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const threads = await this._threadRepository.getDetailThread(useCasePayload);
    const comments = await this._commentRepository.getComments(useCasePayload);
    const replies = await this._replyRepository.getReplies(useCasePayload);

    const commentsWithReply = await comments.map((comment) => {
      const repliesInComment = replies.filter((reply) => reply.comments_id === comment.id)
        .map((reply) => (new GetReply({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
          is_deleted: reply.is_deleted,
        })));
      return new GetComment({
        ...comment,
        replies: repliesInComment,
      });
    });

    const detail = new DetailThread({
      ...threads,
      comments: commentsWithReply,
    });
    return detail;
  }
}
module.exports = GetDetailThreadUseCase;
