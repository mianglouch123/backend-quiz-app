import mongoose from "mongoose";
import { request, response } from "express";
import { FavoritesModel } from "../../models/favorites.model.js";

export class DeleteFavoriteQuiz {
  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();

    try {
      const { userId, quizId } = req.query;

      session.startTransaction();

      const findFavoriteQuizId = await FavoritesModel.findOne({ userId, quizId })
        .lean()
        .session(session);

      if (!findFavoriteQuizId) {
        return res.status(404).json({
          ok: false,
          message: `The favorite with quizId ${quizId} for userId ${userId} wasn't found.`,
          data: []
        });
      }

      await FavoritesModel.findByIdAndDelete(findFavoriteQuizId._id).session(session);

      await session.commitTransaction();

      return res.status(200).json({
        ok: true,
        message: `The favorite with id: ${findFavoriteQuizId._id} was deleted.`,
        data: []
      });

    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("DeleteFavoriteQuiz error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error deleting favorite quiz",
        error: e.message
      });

    } finally {
      session.endSession();
    }
  };
}
