/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comments_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    threads_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notnull: false,
      default: false,
    },
  });
  pgm.addConstraint(
    'replies',
    'fk_replies.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'replies',
    'fk_replies.comments_id_comments.id',
    'FOREIGN KEY(comments_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'replies',
    'fk_replies.threads_id_threads.id',
    'FOREIGN KEY(threads_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
