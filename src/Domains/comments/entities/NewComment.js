/* eslint-disable camelcase */
class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, threads_id } = payload;

    this.content = content;
    this.owner = owner;
    this.threads_id = threads_id;
  }

  _verifyPayload({ content, owner, threads_id }) {
    if (!content || !owner || !threads_id) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof threads_id !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = NewComment;
