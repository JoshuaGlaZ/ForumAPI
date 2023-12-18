exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threads_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comments_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'likes',
    'fk_likes.threads_id_threads.id',
    'FOREIGN KEY(threads_id) REFERENCES threads(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'likes',
    'fk_likes.comments_id_comments.id',
    'FOREIGN KEY(comments_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'likes',
    'fk_replies.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
