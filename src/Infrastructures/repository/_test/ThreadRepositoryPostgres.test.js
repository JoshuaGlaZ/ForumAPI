const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'user123',
      password: 'secret',
      fullname: 'user satu dua tiga',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Pertama',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepository.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Pertama',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Pertama',
        owner: 'user-123',
      }));
    });
  });

  describe('checkThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepository.checkThreadById('thread-987')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepository.checkThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepository.getDetailThread('thread-456')).rejects.toThrowError(NotFoundError);
    });

    it('should get thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        date: '2023-10-28T13:40:26.168Z',
        body: 'Lorem Ipsum',
        owner: 'user-123',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepository.getDetailThread('thread-123');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        owner: 'user-123',
        title: 'title',
        body: 'Lorem Ipsum',
        date: '2023-10-28T13:40:26.168Z',
        username: 'user123',
      });
    });
  });
});
