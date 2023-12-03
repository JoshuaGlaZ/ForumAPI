/* eslint-disable max-len */
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete commment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      owner: 'user-123',
      comments_id: 'comment-123',
      threads_id: 'thread-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threads_id);
    expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.comments_id);
    expect(mockReplyRepository.checkReplyById).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.checkReplyOwner).toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCasePayload.id);
  });
});
