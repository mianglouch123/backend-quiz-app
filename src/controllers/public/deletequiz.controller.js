import mongoose from "mongoose";
import { request, response } from "express";
import { QuizModel } from "../../models/quiz.model.js";
import { QuestionModel } from "../../models/question.model.js";
import { OptionModel } from "../../models/option.model.js";
import { FavoritesModel } from "../../models/favorites.model.js";

export class DeleteQuizController {
  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();

    try {
      const { quizId } = req.params
      if (!quizId) {
        return res.status(400).json({ ok: false, message: "Quiz ID is required", data: null });
      }

      session.startTransaction();

      // Verificar si el quiz existe
      const quiz = await QuizModel.findById(quizId).session(session).lean();
      if (!quiz) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ ok: false, message: `The quiz with ID: ${quizId} wasn't found`, data: null });
      }



      const questions = await QuestionModel.find({ quizId }).session(session).lean();
      const questionIds = questions.map(q => q._id);

      await OptionModel.deleteMany({ questionId: { $in: questionIds } }).session(session);

      await QuestionModel.deleteMany({ quizId }).session(session);

      await QuizModel.findByIdAndDelete(quizId).session(session);

      await FavoritesModel.deleteMany({ quizId }).session(session);

      
      
    

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ ok: true, message: "Quiz deleted successfully", data: quizId });
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error("Error deleting quiz:", e);
      return res.status(500).json({ ok: false, message: "Internal error deleting quiz", error: e.message });
    }finally {
     session.endSession();
    }
  };
}
