/* eslint-disable camelcase */
class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, owner, comments_id, threads_id } = payload;

    this.content = content;
    this.owner = owner;
    this.comments_id = comments_id;
    this.threads_id = threads_id;
  }

  _verifyPayload({ content, owner, comments_id, threads_id }) {
    if (!content || !owner || !comments_id || !threads_id) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof comments_id !== 'string' || typeof threads_id !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = NewReply;
