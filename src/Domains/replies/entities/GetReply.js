class GetReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, username, is_deleted } = payload;

    this.id = id;
    this.content = is_deleted ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({ id, content, date, username }) {
    if (!id || !username || !date || !content) {
      throw new Error('REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
      throw new Error('REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = GetReply;

