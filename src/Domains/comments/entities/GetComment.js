class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, replies, content, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.replies = replies;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, username, date, replies, content }) {
    if (!id || !username || !date || !replies || !content) {
      throw new Error('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || !Array.isArray(replies) || typeof content !== 'string') {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = GetComment;
