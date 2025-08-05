import { request, response } from "express";
import mongoose from "mongoose";
import { QuizModel } from "../../models/quiz.model.js";

export class GetQuizzesController {
  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();
    const { Category } = req.query;

    try {
      session.startTransaction();

      // ✅ Si se pasó la categoría como query
      if (Category) {

        console.log(Category);
        const normalizedCategory = Category.toLowerCase().trim();

        const filteredQuizzesByCategory = await QuizModel.aggregate([
          {
            $lookup: {
              from: "categories", 
              localField: "categoryIds",
              foreignField: "_id",
              let : { categoryInput : normalizedCategory },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        { $toLower: "$categoryName" },
                        normalizedCategory
                      ]
                    }
                  }
                },
                { $project: { _id: 1 } }
              ],
              as: "FilterCategories"
            }
          },
          
          {
            $match: { "FilterCategories.0": { $exists: true } }
          }
        ]).session(session);

        await session.commitTransaction();

        if (filteredQuizzesByCategory.length === 0) {
          return res.status(200).json({
            ok: true,
            message: "No quizzes found for this category",
            data: [],
            category : normalizedCategory
          });
        }

        return res.status(200).json({
          ok: true,
          message: "Quizzes filtered by category",
          data: filteredQuizzesByCategory
        });
      }

      // ✅ Si no hay categoría: retornar todos los quizzes
      const quizzes = await QuizModel.find({}).lean().session(session);

      await session.commitTransaction();

      return res.status(200).json({
        ok: true,
        message: "All quizzes retrieved successfully",
        data: quizzes
      });

    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetQuizzesController error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the quizzes",
        error: e.message
      });

    } finally {
      session.endSession();
    }
  };
}
