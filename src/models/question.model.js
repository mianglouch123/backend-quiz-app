import mongoose from "mongoose";
const { Schema } = mongoose;

const questionSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: Schema.Types.ObjectId, ref: 'Option' }]
});



export const QuestionModel = mongoose.model("Question" , questionSchema);