const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threads_id: 'thread-123',
      comments_id: 'comment-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikedComment = jest.fn(() => Promise.resolve([]));
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threads_id);
    expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.comments_id);
    expect(mockLikeRepository.checkLikedComment).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload);
  });

  it('should orchestrating unlike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threads_id: 'thread-123',
      comments_id: 'comment-123',
      owner: 'user-123',
    };
    const expectedLikedComment = [{
      id: 'like-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      owner: 'user-123',
    }];
    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikedComment = jest.fn(() => Promise.resolve(expectedLikedComment));
    mockLikeRepository.removeLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threads_id);
    expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.comments_id);
    expect(mockLikeRepository.checkLikedComment).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.removeLike).toBeCalledWith(useCasePayload);
  });
});
