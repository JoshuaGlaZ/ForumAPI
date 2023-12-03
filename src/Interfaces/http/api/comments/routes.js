const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threads_id}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threads_id}/comments/{id}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);
module.exports = routes;
