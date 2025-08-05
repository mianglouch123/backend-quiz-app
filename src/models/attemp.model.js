import mongoose from "mongoose";
const { Schema } = mongoose;

const attemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now }
});


export const AttempModel = mongoose.model("Attemp" , attemptSchema);