import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // trims whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate emails
    lowercase: true, // converts to lowercase for consistency
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // optional, tracks createdAt and updatedAt
});

const User = mongoose.model("User", userSchema);
export default User;
