const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// 🔥 Better duplicate error handling
userSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Email already registered"));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);