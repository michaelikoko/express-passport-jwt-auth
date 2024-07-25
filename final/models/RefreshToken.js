const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.plugin(uniqueValidator);
module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
