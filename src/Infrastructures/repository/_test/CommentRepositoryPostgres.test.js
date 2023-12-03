const pool = require('../../database/postgres/pool');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
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
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'Halo halo halo halo',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);

      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });
    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'Hai, hai',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const CommentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await CommentRepository.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Hai, hai',
        owner: 'user-123',
      }));
    });
  });

  describe('checkCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepository.checkCommentById('comment-987')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepository.checkCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('checkCommentOwner function', () => {
    it('should throw AuthorizationError when comment owner is not', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-987',
        username: 'bukan pemilik',
        fullname: 'bukan pemilik',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepository.checkCommentOwner('comment-123', 'user-987')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw Authorization when comment owner is correct', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepository.checkCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment from database', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepository.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comment[0].is_deleted).toEqual(true);
    });

    it('should return NotFoundError when comment is not found', async () => {
      // Arrange
      await CommentTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-123',
        threads_id: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepository.deleteCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getComments function', () => {
    it('should return empty array when comment not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepository.getComments('thread-123');

      // Assert
      expect(comments).toStrictEqual([]);
    });

    it('should get comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'user456',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threads_id: 'thread-123',
        content: 'sebuah konten dari 123',
        date: '2023-10-28T15:15:48.132Z',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-456',
        threads_id: 'thread-123',
        content: 'sebuah konten dari 456',
        date: '2023-10-28T15:15:48.132Z',
        is_deleted: true,
      });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepository.getComments('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0]).toHaveProperty('id', 'comment-123');
      expect(comments[0]).toHaveProperty('username', 'user123');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('content', 'sebuah konten dari 123');
      expect(comments[0]).toHaveProperty('is_deleted', false);
      expect(comments[1]).toHaveProperty('id', 'comment-456');
      expect(comments[1]).toHaveProperty('username', 'user456');
      expect(comments[1]).toHaveProperty('date');
      expect(comments[1]).toHaveProperty('content', 'sebuah konten dari 456');
      expect(comments[1]).toHaveProperty('is_deleted', true);
    });
  });
});
