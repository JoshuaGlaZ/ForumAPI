const GetReply = require('../GetReply');

describe('GetReply Entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: {},
      date: '2023-10-28T13:40:26.168Z',
      username: 'user satu',
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetReply(payload)).toThrowError('REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah content',
      date: '2023-10-28T13:40:26.168Z',
      username: 'user satu',
      is_deleted: false,
    };

    // Action
    const { id, username, date, content } = new GetReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create reply object correctly when value is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah content',
      date: '2023-10-28T13:40:26.168Z',
      username: 'user satu',
      is_deleted: true,
    };

    // Action
    const { id, username, date, content } = new GetReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
