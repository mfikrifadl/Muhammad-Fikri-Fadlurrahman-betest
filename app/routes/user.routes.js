module.exports = (app) => {
  const user = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", user.create);

  // Login User
  router.post("/login", user.signIn);

  // Retrieve all user
  router.get("/", user.loginRequired, user.getAll);

  // Retrieve a single User with id
  router.get("/:id", user.loginRequired, user.findById);

  // Update a User with id
  router.put("/:id", user.loginRequired, user.update);

  // Delete a User with id
  router.delete("/:id", user.loginRequired, user.delete);

  app.use("/api/user", router);
};
