import mongoose from "mongoose";
import { request, response } from "express";
import { UserModel } from "../../models/user.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { CategoryModel } from "../../models/category.model.js";
import { QuestionModel } from "../../models/question.model.js";
import { OptionModel } from "../../models/option.model.js";

export class CreateQuizController {
  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();

    try {
      const { userId, quizTitle, questions, categoryName } = req.body;

      session.startTransaction();

      const user = await UserModel.findById(userId).session(session).lean();
      if (!user) {
        return res.status(400).json({ ok: false, message: "User not found", data: null });
      }

      let category = await CategoryModel.findOne({ categoryName }).session(session).lean();
      if (!category) {
        const newCategory = await new CategoryModel({ categoryName }).save({ session });
        category = newCategory.toObject();
      }

      const newQuiz = await new QuizModel({ title: quizTitle, userId, categoryId: category._id }).save({ session });

      const questionIds = [];

      for (let q of questions) {
        const { questionText, options } = q;
        const questionDoc = await new QuestionModel({
          quizId: newQuiz._id,
          question: questionText,
        }).save({ session });

        const optionIds = [];

        for (let opt of options) {
          const optionDoc = await new OptionModel({
            questionId: questionDoc._id,
            option: opt.option,
            isCorrect: opt.isCorrect,
          }).save({ session });
          optionIds.push(optionDoc._id);
        }

        // Actualizar la pregunta con los options
        await QuestionModel.findByIdAndUpdate(
          questionDoc._id,
          { options: optionIds },
          { session }
        );

        questionIds.push(questionDoc._id);
      }

      // Actualizar el quiz con las preguntas
     await QuizModel.findByIdAndUpdate(
     newQuiz._id,
    {
    $push: { categoryIds: category._id }, // Agregas la categoría al array
    $set: { questions: questionIds }      // Actualizas las preguntas
  },
  { session }
);

      
    await UserModel.findByIdAndUpdate(
    userId,
  { $push: { quizzes: newQuiz._id } },
  { session }
);


      await session.commitTransaction();
      return res.status(201).json({ ok: true, message: "Quiz created successfully", data: { quizId: newQuiz._id } });

    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      return res.status(500).json({ ok: false, message: "Internal error creating quiz", error: e.message });
    } finally {
      session.endSession();
    }
  };
}
