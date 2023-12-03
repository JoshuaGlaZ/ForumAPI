const pool = require('../../database/postgres/pool');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('RepliesRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
      password: 'secret',
      fullname: 'user satu dua tiga',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'simple title',
      body: 'once twice thrice',
      date: new Date().toISOString(),
      owner: 'user-123',
    });
    await CommentTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
      date: new Date().toISOString(),
      content: 'sebuah seribu konten',
      threads_id: 'thread-123',
      is_deleted: false,
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'Hmmm, baik',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const repliesRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await repliesRepository.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Hmmm, baik',
        owner: 'user-123',
      }));
    });
  });

  describe('checkReplyById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepository.checkReplyById('reply-987')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepository.checkReplyById('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('checkReplyOwner function', () => {
    it('should throw AuthorizationError when reply owner is not', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-987',
        username: 'bukan pemilik',
        fullname: 'bukan pemilik',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepository.checkReplyOwner('reply-123', 'user-987')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw Authorization when reply owner is correct', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepository.checkReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply from database', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepository.deleteReplyById('reply-123');

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply[0].is_deleted).toEqual(true);
    });

    it('should return NotFoundError when reply is not found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(replyRepository.deleteReplyById('reply -123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getReplies', () => {
    it('should return empty array when replies not found', async () => {
      // Arrange
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepository.getReplies('comment-123');

      // Assert
      expect(replies).toStrictEqual([]);
    });

    it('should get replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'user456',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'sebuah konten dari 123',
        date: '2023-10-28T15:15:48.132Z',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        content: 'sebuah konten dari 456',
        date: '2023-10-28T15:15:48.132Z',
        owner: 'user-456',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
        is_deleted: true,
      });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepository.getReplies('thread-123');

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0]).toHaveProperty('id', 'reply-123');
      expect(replies[0]).toHaveProperty('username', 'user123');
      expect(replies[0]).toHaveProperty('date');
      expect(replies[0]).toHaveProperty('content', 'sebuah konten dari 123');
      expect(replies[0]).toHaveProperty('is_deleted', false);
      expect(replies[1]).toHaveProperty('id', 'reply-456');
      expect(replies[1]).toHaveProperty('username', 'user456');
      expect(replies[1]).toHaveProperty('date');
      expect(replies[1]).toHaveProperty('content', 'sebuah konten dari 456');
      expect(replies[1]).toHaveProperty('is_deleted', true);
    });
  });
});
