module.exports = (mongoose) => {
  var bcrypt = require("bcrypt");

  var schema = mongoose.Schema(
    {
      userName: {
        type: String,
        trim: true,
        required: true,
      },
      userType: {
        type: String,
        enum: ["consumer", "producer"],
        required: true,
        default: "consumer",
      },
      accountNumber: Number,
      emailAddress: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
      },
      identityNumber: Number,
      hashPassword: {
        type: String,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
