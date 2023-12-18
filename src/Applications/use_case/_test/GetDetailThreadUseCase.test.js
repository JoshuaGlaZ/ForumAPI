const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const GetReply = require('../../../Domains/replies/entities/GetReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetDetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threads_id: 'thread-123',
    };

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '2023-10-28T13:40:26.168Z',
      username: 'user123',
      comments: [
        new GetComment({
          id: 'comment-123',
          username: 'user satu',
          date: '2023-10-28T13:40:26.168Z',
          replies: [
            new GetReply({
              id: 'reply-123',
              content: 'sebuah konten balasan dari user satu',
              date: '2023-10-29T09:29:32.033Z',
              username: 'user satu',
              is_deleted: false,
            }),
            new GetReply({
              id: 'reply-456',
              content: 'sebuah konten balasan dari user dua',
              date: '2023-10-29T09:29:32.033Z',
              username: 'user dua',
              is_deleted: true,
            }),
          ],
          content: 'sebuah content',
          likeCount: 0,
          is_deleted: false,
        }),
        new GetComment({
          id: 'comment-456',
          username: 'user dua',
          date: '2023-10-28T13:40:26.168Z',
          replies: [],
          content: 'konten test',
          likeCount: 0,
          is_deleted: true,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'sebuah title',
        body: 'sebuah body',
        date: '2023-10-28T13:40:26.168Z',
        owner: 'user-123',
        username: 'user123',
      }));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          owner: 'user-123',
          username: 'user satu',
          date: '2023-10-28T13:40:26.168Z',
          threads_id: 'thread-123',
          content: 'sebuah content',
          is_deleted: false,
        },
        {
          id: 'comment-456',
          owner: 'user-456',
          username: 'user dua',
          date: '2023-10-28T13:40:26.168Z',
          threads_id: 'thread-123',
          content: 'konten test',
          is_deleted: true,
        },
      ]));
    mockReplyRepository.getReplies = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'reply-123',
          content: 'sebuah konten balasan dari user satu',
          date: '2023-10-29T09:29:32.033Z',
          owner: 'user-123',
          username: 'user satu',
          comments_id: 'comment-123',
          threads: 'thread-123',
          is_deleted: false,
        },
        {
          id: 'reply-456',
          content: 'sebuah konten balasan dari user dua',
          date: '2023-10-29T09:29:32.033Z',
          owner: 'user-456',
          username: 'user dua',
          comments_id: 'comment-123',
          threads: 'thread-123',
          is_deleted: true,
        },
      ]));
    mockLikeRepository.getLikes = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          comments_id: 'comment-123',
          likeCount: 0,
        },
      ]));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      likeRepository: mockLikeRepository,
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getDetailThread).toHaveBeenCalledWith(useCasePayload);
    expect(mockCommentRepository.getComments).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.getReplies).toHaveBeenCalledWith(useCasePayload);
    expect(mockLikeRepository.getLikes).toHaveBeenCalledWith(useCasePayload);
    expect(getDetailThread).toStrictEqual(expectedDetailThread);
  });
});
