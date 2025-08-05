import { Schema } from "mongoose";
import mongoose from "mongoose";


const optionSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  option: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

export const OptionModel = mongoose.model("Option", optionSchema);