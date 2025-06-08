import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  searchHistory: {
    type: Array,
    default: [],
  },
  videoHistory: {
    type: Array,
    default: [],
  },
  quizHistory: {
    type: Array,
    default: [],
  },
});

// Prevent model overwrite in dev
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
