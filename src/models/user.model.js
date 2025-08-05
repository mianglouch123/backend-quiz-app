import mongoose from "mongoose";
const { Schema } = mongoose;

// User
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }]
});





export const UserModel = mongoose.model("User" , userSchema); 
