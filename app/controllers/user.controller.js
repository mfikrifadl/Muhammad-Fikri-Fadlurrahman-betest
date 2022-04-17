const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Redis = require("../config/redis");

exports.create = async (req, res) => {
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

  if (!req.body.password) {
    res.status(400).send({ message: "password can not be empty!" });
    return;
  }
  var userType = "consumer";

  if (req.body.userType) {
    userType = req.body.userType;
  }

  const checkEmail = await findByEmail(req.body.emailAddress);
  if (checkEmail) {
    res.status(500).send({ message: "Email has been used" });
    return;
  }

  const checkAccountNumber = await findByAccountNumber(req.body.accountNumber);
  if (checkAccountNumber) {
    res.status(500).send({ message: "Account number has been used" });
    return;
  }

  const checkIdentityNumber = await findByIdentityNumber(
    req.body.identityNumber
  );

  if (checkIdentityNumber) {
    res.status(500).send({ message: "Identify number has been used" });
    return;
  }

  const user = new User({
    userName: req.body.userName,
    accountNumber: req.body.accountNumber,
    emailAddress: req.body.emailAddress,
    identityNumber: req.body.identityNumber,
    hashPassword: bcrypt.hashSync(req.body.password, 10),
    userType: userType,
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

const findByEmail = (email) => {
  return new Promise((resolve) => {
    User.findOne(
      {
        emailAddress: email,
      },
      function (error, data) {
        resolve(data);
      }
    );
  });
};

const findByAccountNumber = (accountNumber) => {
  return new Promise((resolve) => {
    User.findOne(
      {
        accountNumber: accountNumber,
      },
      function (error, data) {
        resolve(data);
      }
    );
  });
};

const findByIdentityNumber = (identityNumber) => {
  return new Promise((resolve) => {
    User.findOne(
      {
        identityNumber: identityNumber,
      },
      function (error, data) {
        resolve(data);
      }
    );
  });
};

exports.signIn = async (req, res) => {
  const user = await findByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({
      code: 401,
      message: "Authentication failed. Invalid user not found.",
    });
  }

  bcrypt.compare(req.body.password, user.hashPassword, function (err, result) {
    if (err) throw err;
    if (!result) {
      return res.status(401).json({
        code: 401,
        message: "Authentication failed. Password Wrong",
      });
    }

    return res.json({
      code: 200,
      message: "Success Login User",
      token: jwt.sign(
        { email: user.email, fullName: user.fullName, _id: user._id },
        "RESTFULAPIs"
      ),
    });
  });
};

exports.loginRequired = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!!" });
  }
};

exports.getAll = async (req, res) => {
  const accountNumber = req.query.accountNumber;
  const identityNumber = req.query.identityNumber;

  let condition = {};
  if (accountNumber) {
    condition["accountNumber"] = accountNumber;
  }
  if (identityNumber) {
    condition["identityNumber"] = identityNumber;
  }

  const { reply } = await Redis.get(JSON.stringify(condition));
  if (reply) {
    res.status(200).send({
      code: 200,
      message: "Success get all users from redis",
      data: reply,
    });
  } else {
    User.find(condition)
      .then((data) => {
        Redis.set(JSON.stringify(condition), JSON.stringify(data));

        res.status(200).send({
          code: 200,
          message: "Success get all users from db",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          code: 500,
          message: err.message || "Some error occurred while retrieving users.",
        });
      });
  }
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  const { reply } = await Redis.get(id);
  if (reply) {
    res.status(200).send({
      code: 200,
      message: "Success get user with id " + id + " from redis",
      data: reply,
    });
  } else {
    User.findById(id)
      .then((data) => {
        if (!data)
          res.status(404).send({
            code: 404,
            message: "Not found User with id " + id,
          });
        else {
          Redis.set(id, JSON.stringify(data));
          res.status(200).send({
            code: 200,
            message: "Success get user with id " + id + " from db",
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
  }
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
