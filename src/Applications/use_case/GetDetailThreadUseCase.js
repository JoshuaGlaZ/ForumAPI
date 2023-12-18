const GetComment = require('../../Domains/comments/entities/GetComment');
const GetReply = require('../../Domains/replies/entities/GetReply');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

/* eslint-disable quotes */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const threads = await this._threadRepository.getDetailThread(useCasePayload);
    const comments = await this._commentRepository.getComments(useCasePayload);
    const replies = await this._replyRepository.getReplies(useCasePayload);
    const likes = await this._likeRepository.getLikes(useCasePayload);

    const commentsWithReply = comments.map((comment) => {
      const like = likes.find((count) => count.comments_id === comment.id);
      const repliesInComment = replies
        .filter((reply) => reply.comments_id === comment.id)
        .map((reply) => (new GetReply({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
          is_deleted: reply.is_deleted,
        })));
      const c = new GetComment({
        ...comment,
        likeCount: like && like.likecount !== undefined ? like.likecount : 0,
        replies: repliesInComment,
      });
      return c;
    });

    const detail = new DetailThread({
      ...threads,
      comments: commentsWithReply,
    });
    return detail;
  }
}
module.exports = GetDetailThreadUseCase;
