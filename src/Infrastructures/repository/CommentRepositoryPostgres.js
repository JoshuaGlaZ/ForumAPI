/* eslint-disable quotes */
/* eslint-disable camelcase */
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const Authorization = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, owner, threads_id } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, date, content, threads_id],
    };
    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async checkCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async checkCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new Authorization('anda bukan pemilik dari comment ini');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getComments(threads_id) {
    const query = {
      text: `SELECT comments.*, users.username
        FROM comments LEFT JOIN users ON comments.owner = users.id WHERE comments.threads_id = $1
        ORDER BY comments.date ASC`,
      values: [threads_id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = CommentRepositoryPostgres;
