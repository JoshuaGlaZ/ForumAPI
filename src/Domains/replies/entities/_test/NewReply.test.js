const NewReply = require('../NewReply');

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 'user-123',
      comments_id: 'comment-123',
      threads_id: 'threads-123',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'test 123',
      owner: 'user-123',
      comments_id: 'comment-123',
      threads_id: 'threads-123',
    };

    // Action
    // eslint-disable-next-line camelcase
    const { content, owner, comments_id, threads_id } = new NewReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(comments_id).toEqual(payload.comments_id);
    expect(threads_id).toEqual(payload.threads_id);
  });
});
