import mongoose from "mongoose";
import { request, response } from "express";
import { QuestionModel } from "../../models/question.model.js";
import { OptionModel } from "../../models/option.model.js";
import { AttempModel } from "../../models/attemp.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { UserModel } from "../../models/user.model.js";

export class TakeQuizController {
  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();
    try {
      

     const { userId, quizId, data } = req.body;

     session.startTransaction();
     
     const findUser = await UserModel.findById(userId).lean().session(session);

     const findQuiz = await QuizModel.findById(quizId).lean().session(session);

      if(!findQuiz) {
      return res.status(400).json({ ok: false, message: "Error to find the quiz", error: e.message });

      }

      if(!findUser) {
      return res.status(400).json({ ok: false, message: "Error to find the user", error: e.message });

      }

      // Registrar el intento vacío primero
      const attemp = await new AttempModel({ userId, quizId }).save({ session });

      // Obtener total de preguntas del quiz
      const totalQuestions = await QuestionModel.countDocuments({ quizId }).session(session);

      let correctAnswers = 0;

      // Recorrer cada pregunta respondida
      for (let i = 0; i < data.length; i++) {
        const { questionId, optionId } = data[i];

        // Verificar si la opción es correcta
        const option = await OptionModel.findOne({ _id: optionId, questionId }).lean().session(session);

        if (option && option.isCorrect) {
          correctAnswers++;
        }
      }

      // Calcular el score como porcentaje
      const score = Math.floor( (correctAnswers / totalQuestions) * 100);

      // Actualizar el intento con el score
      await AttempModel.findByIdAndUpdate(attemp._id, { $set: { score } }, { session });

      
      await session.commitTransaction();
      
      return res.status(200).json({
        ok: true,
        message: "Take quizz sucessfully",
        data: { userId, quizId, score },
      });
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.log(e);
      return res.status(500).json({ ok: false, message: "Internal error while registering the quiz result", error: e.message });
    } finally {
      session.endSession();
    }
  };
}
