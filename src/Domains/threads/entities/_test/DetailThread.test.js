const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      body: [],
      date: '2023-10-28T13:40:26.168Z',
      username: true,
      comments: [
        {
          id: 'comment-123',
          username: 'user satu',
          date: '2023-10-28T13:40:26.168Z',
          content: 'sebuah content',
          is_deleted: false,
        },
        {
          id: 'comment-456',
          username: 'user dua',
          date: '2023-10-28T13:40:26.168Z',
          content: 'sebuah konten dari user dua',
          is_deleted: true,
        },
      ],
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah title',
      body: 'sebuah body',
      date: '2023-10-28T13:40:26.168Z',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user satu',
          date: '2023-10-28T13:40:26.168Z',
          content: 'sebuah content',
          is_deleted: false,
        },
        {
          id: 'comment-456',
          username: 'user dua',
          date: '2023-10-28T13:40:26.168Z',
          content: 'sebuah konten dari user dua',
          is_deleted: true,
        },
      ],
    };

    // Action
    const { id, title, body, date, username, comments } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
