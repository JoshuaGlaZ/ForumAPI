/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('LikeRepositoryPostgres', () => {
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
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      owner: 'user-123',
      date: new Date().toISOString(),
      content: 'sebuah seribu konten',
      threads_id: 'thread-123',
      is_deleted: false,
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist like comment correctly', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
        threads_id: 'thread-123',
        comments_id: 'comment-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      const likedComment = await LikesTableTestHelper.findLikeById('like-123');
      expect(likedComment[0].threads_id).toEqual('thread-123');
      expect(likedComment[0].comments_id).toEqual('comment-123');
      expect(likedComment[0].owner).toEqual('user-123');
    });
  });

  describe('removeLike function', () => {
    it('should remove like comment correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });

      const payload = {
        owner: 'user-123',
        threads_id: 'thread-123',
        comments_id: 'comment-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.removeLike(payload);

      // Assert
      const unlikedComment = await LikesTableTestHelper.findLikeById('like-123');
      expect(unlikedComment).toStrictEqual([]);
    });
  });

  describe('checkLikedComment function', () => {
    it('should return empty array when liked comment is not found', async () => {
      const payload = {
        owner: 'user-456',
        threads_id: 'thread-456',
        comments_id: 'comment-456',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likedComment = await likeRepositoryPostgres.checkLikedComment(payload);

      // Assert
      expect(likedComment).toStrictEqual([]);
    });

    it('should return if user like this comment', async () => {
      // Arrange

      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });

      const payload = {
        owner: 'user-123',
        threads_id: 'thread-123',
        comments_id: 'comment-123',
      };

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likedComment = await likeRepositoryPostgres.checkLikedComment(payload);

      // Assert
      expect(likedComment).toHaveLength(1);
      expect(likedComment[0].id).toEqual('like-123');
      expect(likedComment[0].threads_id).toEqual('thread-123');
      expect(likedComment[0].comments_id).toEqual('comment-123');
      expect(likedComment[0].owner).toEqual('user-123');
    });
  });

  describe('getLikes function', () => {
    it('should return like comment counts', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });
      await LikesTableTestHelper.addLike({
        id: 'like-456',
        owner: 'user-123',
        comments_id: 'comment-123',
        threads_id: 'thread-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await likeRepositoryPostgres.getLikes('thread-123');

      // Assert
      expect(likeCount).toHaveLength(1);
      expect(likeCount[0].comments_id).toEqual('comment-123');
      expect(likeCount[0].likecount).toEqual('2');
    });

    it('should return empty array when comment has no like', async () => {
      // Arrange

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      const likeCount = await likeRepositoryPostgres.getLikes('thread-123');

      // Assert
      expect(likeCount).toHaveLength(0);
    });
  });
});
