/* eslint-disable max-len */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete commment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
      threads_id: 'thread-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThreadById).toBeCalledWith(useCasePayload.threads_id);
    expect(mockCommentRepository.checkCommentById).toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.checkCommentOwner).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.id);
  });
});
