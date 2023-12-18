const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threads_id}/comments/{comments_id}/likes',
    handler: handler.putLikeHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);
module.exports = routes;
