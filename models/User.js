const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Burada şifrelerin encrypt edilerek kaydedilmesi sağlanıyor.
UsersSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err, encrypted) {
    user.password = encrypted;
    next();
  });
});

const User = mongoose.model("User", UsersSchema);

module.exports = User;
