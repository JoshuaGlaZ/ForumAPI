class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, replies, content, likeCount, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
    this.likeCount = parseInt(likeCount, 10);
  }

  _verifyPayload({ id, username, date, replies, content, likeCount }) {
    if (!id || !username || !date || !replies || !content
      || likeCount === null || likeCount === undefined) {
      throw new Error('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string'
      || !Array.isArray(replies) || typeof content !== 'string' || Number.isNaN(likeCount)) {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = GetComment;
