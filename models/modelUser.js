import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 10000, // 100 Rs = 10000 paisa
    },
    userId: {
      type: String,
      required: true,
      unique: true, // this already creates an index
      minlength: 5,
      maxlength: 5,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
