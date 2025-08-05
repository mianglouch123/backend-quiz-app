import mongoose from "mongoose";
import { request, response } from "express";
import { QuizModel } from "../../models/quiz.model.js";
import { UserModel } from "../../models/user.model.js";
import { QuestionModel } from "../../models/question.model.js";
import { OptionModel } from "../../models/option.model.js";

export class UpdateQuizController {
  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();

    try {
      const { userId, title, quizId, data } = req.body;

      session.startTransaction();

      // Validar que el usuario y el quiz existen
      const user = await UserModel.findById(userId).session(session);
      const quiz = await QuizModel.findById(quizId).session(session);

      if (!user || !quiz) {
        await session.abortTransaction();
        return res.status(404).json({
          ok: false,
          message: "Quiz not found or user not found",
          error: null,
        });
      }

      // Actualizar título del quiz si se proporciona
      if (typeof title === "string" && title.trim() !== "") {
        await QuizModel.findByIdAndUpdate(
          quizId,
          { $set: { title: title.trim() } },
          { session }
        );
      }

      // Validar datos para actualización
      if (!data || !Array.isArray(data) || data.length === 0) {
        await session.abortTransaction();
        return res.status(400).json({ 
          ok: false, 
          message: "No data provided for update", 
          error: null 
        });
      }

      for (const item of data) {
        const { questionId, question: newQuestionText, options } = item;
        
        // Validar pregunta
        const existingQuestion = await QuestionModel.findOne({
          _id: questionId,
          quizId
        }).session(session);

        if (!existingQuestion) {
          await session.abortTransaction();
          return res.status(404).json({ 
            ok: false, 
            message: "Question not found or doesn't belong to user/quiz", 
            error: null 
          });
        }

        // Actualizar texto de la pregunta si es diferente y válido
        if (typeof newQuestionText === "string" && 
            newQuestionText.trim() !== "" && 
            existingQuestion.question.toLowerCase().trim() !== newQuestionText.toLowerCase().trim()) {
          await QuestionModel.findByIdAndUpdate(
            questionId,
            { $set: { question: newQuestionText.trim() } },
            { session }
          );
        }

        // Validar opciones
        if (!Array.isArray(options) || options.length === 0) continue;

        for (const option of options) {
          const { _id : id, option : value, isCorrect } = option;
          
          // Validar opción
          const existingOption = await OptionModel.findOne({
            _id: id,
            questionId
          }).session(session);

          if (!existingOption) {
            await session.abortTransaction();
            return res.status(404).json({ 
              ok: false, 
              message: "Option not found", 
              error: null 
            });
          }

          // Si la opción es correcta, desmarcar otras
          if (isCorrect === true) {
            await OptionModel.updateMany(
              { questionId },
              { $set: { isCorrect: false } },
              { session }
            );
          }

          // Actualizar opción
          await OptionModel.findByIdAndUpdate(
            id,
            { 
              $set: { 
                option: value.trim(),
                isCorrect: Boolean(isCorrect) 
              } 
            },
            { session }
          );
        }
      }

      await session.commitTransaction();
      return res.status(200).json({
        ok: true,
        message: "Quiz updated successfully",
        data: quizId,
      });

    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("Error updating quiz:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal server error while updating quiz",
        error: e.message,
      });
    } finally {
      session.endSession();
    }
  };
}