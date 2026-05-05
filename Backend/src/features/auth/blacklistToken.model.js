const mongoose = require("mongoose");
const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      require: [true, "Token is required"],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistTokenModel = mongoose.model(
  "blacklistToken",
  blacklistTokenSchema,
);
module.exports = blacklistTokenModel;
