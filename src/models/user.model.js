const mongosoe = require("mongoose");
const userSchema = new mongosoe.Schema(
  {
    userName: {
      type: String,
      require: [true, "Username is required"],
      trim: true,
      unique: [true, "Username is already taken"],
      index: true,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email already registered"],
      lowercase: true,
      trim: true,
      match: [
        /^(?!\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      require: [true, "Password require"],
      trim: true,
      minlength: [8, "At least 8 characters are reuired "],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
