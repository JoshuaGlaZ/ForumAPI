const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threads_id}/comments/{comments_id}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threads_id}/comments/{comments_id}/replies/{id}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);
module.exports = routes;
