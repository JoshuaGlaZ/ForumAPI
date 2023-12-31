/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    content: {
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
    'comments',
    'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'comments',
    'fk_comments.threads_id_threads.id',
    'FOREIGN KEY(threads_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
