const db = require("../models");
const User = db.users;

exports.create = (req, res) => {
  if (!req.body.userName) {
    res.status(400).send({ message: "userName can not be empty!" });
    return;
  }

  if (!req.body.accountNumber) {
    res.status(400).send({ message: "accountNumber can not be empty!" });
    return;
  }

  if (!req.body.emailAddress) {
    res.status(400).send({ message: "emailAddress can not be empty!" });
    return;
  }

  if (!req.body.identityNumber) {
    res.status(400).send({ message: "identityNumber can not be empty!" });
    return;
  }

  const user = new User({
    userName: req.body.userName,
    accountNumber: req.body.accountNumber,
    emailAddress: req.body.emailAddress,
    identityNumber: req.body.identityNumber,
  });

  user
    .save(user)
    .then((data) => {
      res.status(200).send({
        code: 200,
        message: "Success create user",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

exports.getAll = (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).send({
        code: 200,
        message: "Success get all users",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findById = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({
          code: 404,
          message: "Not found User with id " + id,
        });
      else {
        res.status(200).send({
          code: 200,
          message: "Success get user with id " + id,
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error retrieving User with id " + id,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      code: 400,
      message: "Data to update can not be empty!",
    });
  }

  const data = req.body;

  const id = req.params.id;

  User.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          code: 404,
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          code: 200,
          message: "User was updated successfully.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Error updating User with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          code: 404,
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      } else {
        res.send({
          code: 200,
          message: "User was deleted successfully!",
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        code: 500,
        message: "Could not delete User with id=" + id,
      });
    });
};
