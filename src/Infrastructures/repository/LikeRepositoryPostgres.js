const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(payload) {
    const { threads_id, comments_id, owner } = payload;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4)',
      values: [id, threads_id, comments_id, owner],
    };
    await this._pool.query(query);
  }

  async removeLike(payload) {
    const { threads_id, comments_id, owner } = payload;
    const query = {
      text: 'DELETE FROM likes WHERE threads_id = $1 AND comments_id = $2 AND owner = $3',
      values: [threads_id, comments_id, owner],
    };
    await this._pool.query(query);
  }

  async checkLikedComment(payload) {
    const { threads_id, comments_id, owner } = payload;
    const query = {
      text: 'SELECT * FROM likes WHERE threads_id = $1 AND comments_id=$2 AND owner = $3',
      values: [threads_id, comments_id, owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getLikes(threads_id) {
    const query = {
      text: `SELECT comments_id, COUNT(l.id) 
      AS likeCount 
      FROM likes l
      JOIN comments c 
        ON c.id = l.comments_id
      JOIN threads t 
        ON t.id = c.threads_id
      WHERE t.id = $1
      GROUP BY l.comments_id`,
      values: [threads_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
