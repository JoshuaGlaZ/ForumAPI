/* eslint-disable quotes */
/* eslint-disable camelcase */
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Authorization = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, owner, comments_id, threads_id } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, comments_id, threads_id],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async checkReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async checkReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const reply = result.rows[0];
    if (reply.owner !== owner) {
      throw new Authorization('anda bukan pemilik dari reply ini');
    }
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async getReplies(threads_id) {
    const query = {
      text: `SELECT replies.*, users.username
        FROM replies LEFT JOIN users ON replies.owner = users.id WHERE replies.threads_id = $1
        ORDER BY replies.date ASC `,
      values: [threads_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = ReplyRepositoryPostgres;
