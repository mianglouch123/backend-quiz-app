import mongoose from "mongoose";
const { Schema } = mongoose;

const quizSchema = new Schema({
  title: { type: String, required: true },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }], // múltiples categorías
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean, default: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

export const QuizModel = mongoose.model("Quiz" , quizSchema);
