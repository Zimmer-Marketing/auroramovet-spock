/// <reference path="../pb_data/types.d.ts" />

// posts create/update/delete were "" (anyone on the internet could add, edit or
// delete blog posts through the API). The site only reads posts; staff edit them
// in the PocketBase dashboard as superusers, which bypasses rules. Reads stay public.
migrate((app) => {
  const posts = app.findCollectionByNameOrId("posts");
  posts.createRule = null;
  posts.updateRule = null;
  posts.deleteRule = null;
  app.save(posts);
}, (app) => {
  const posts = app.findCollectionByNameOrId("posts");
  posts.createRule = "";
  posts.updateRule = "";
  posts.deleteRule = "";
  app.save(posts);
});
