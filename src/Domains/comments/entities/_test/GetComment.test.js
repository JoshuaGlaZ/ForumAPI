const GetComment = require('../GetComment');

describe('Comments Entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user satu',
      date: '2023-10-28T13:40:26.168Z',
      replies: 123,
      content: {},
      likeCount: true,
      is_deleted: false,
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comments object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user satu',
      date: '2023-10-28T13:40:26.168Z',
      replies: [{
        id: 'reply-123',
        content: 'sebuah konten balasan dari user satu',
        date: '2023-10-29T09:29:32.033Z',
        username: 'user satu',
        is_deleted: false,
      },
      {
        id: 'reply-456',
        content: 'sebuah konten balasan dari user dua',
        date: '2023-10-29T09:29:32.033Z',
        username: 'user dua',
        is_deleted: true,
      }],
      content: 'sebuah content',
      likeCount: 0,
      is_deleted: false,
    };

    // Action
    const { id, username, date, replies, content, likeCount } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(payload.likeCount);
  });

  it('should create comments object correctly when value is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user satu',
      date: '2023-10-28T13:40:26.168Z',
      replies: [{
        id: 'reply-123',
        content: 'sebuah konten balasan dari user satu',
        date: '2023-10-29T09:29:32.033Z',
        username: 'user satu',
        is_deleted: false,
      },
      {
        id: 'reply-456',
        content: 'sebuah konten balasan dari user dua',
        date: '2023-10-29T09:29:32.033Z',
        username: 'user dua',
        is_deleted: true,
      }],
      content: 'sebuah content',
      likeCount: 0,
      is_deleted: true,
    };

    // Action
    const { id, username, date, replies, content, likeCount } = new GetComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual(payload.replies);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(likeCount).toEqual(payload.likeCount);
  });
});
