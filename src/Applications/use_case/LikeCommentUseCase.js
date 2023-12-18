class LikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.checkThreadById(payload.threads_id);
    await this._commentRepository.checkCommentById(payload.comments_id);
    const likedComment = await this._likeRepository.checkLikedComment(payload);

    if (likedComment.length === 0) {
      await this._likeRepository.addLike(payload);
    } else {
      await this._likeRepository.removeLike(payload);
    }
  }
}

module.exports = LikeCommentUseCase;
