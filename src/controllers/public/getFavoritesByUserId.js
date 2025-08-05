import mongoose from "mongoose";
import { UserModel } from "../../models/user.model.js";
import { FavoritesModel } from "../../models/favorites.model.js";
import { request , response } from "express";
import { QuizModel } from "../../models/quiz.model.js";

export class GetFavoriteQuizzesByUserId {

run = async ( req = request, res = response ) => {

const session = await mongoose.startSession();

try {

const { userId } = req.params;

const { sortBy = "playedAt" , order = "desc" } = req.query;

session.startTransaction();

const findUserId = await UserModel.findById(userId).lean().session(session);

if(!findUserId) {
return res.status(300).json({ ok : false , message : `the user ${userId} was'nt found `,  data : [] })
}

const limit = 5;
const page = req.query.page || 1;
const skip = parseInt((page - 1) * limit);


const quizzesFavoritesByUserId = await FavoritesModel.aggregate([

  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
    }
  },

  {
    $lookup: {
      from: "quizzes",
      localField: "quizId",
      foreignField: "_id",
      as: "quiz"
    }
  },

  { $unwind: "$quiz" },

  {
    $lookup: {
      from: "categories",
      let: { ids: "$quiz.categoryIds" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$ids"] }
          }
        },
      ],
      as: "categoriesMatched"
    }
  },

  {
    $lookup: {
      from: "attemps",
      let: { quizId: "$quiz._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$quizId", "$$quizId"] },
                { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }
              ]
            }
          }
        },
        {
          $sort: { [sortBy]: order === "desc" ? -1 : 1 }
        }
      ],
      as: "attemps"
    }
  },

  {
    $project: {
      _id: 0,
      quizId: "$quiz._id",
      title: "$quiz.title",
      playedAt: { $first: "$attemps.playedAt" },
      totalScore: { $first: "$attemps.score" },
      categories: "$categoriesMatched.categoryName"
    }
  },
  { $skip:  skip },
  { $limit: limit }

]).session(session);

await session.commitTransaction();

return res.status(200).json({ok : true , message : `quizzes favorites sent: ` , 
data : quizzesFavoritesByUserId});

}
catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetFavoriteQuizzesByUserId error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the GetFavoriteQuizzesByUserId",
        error: e.message
      });

    } 
    finally {
    session.endSession();
    }
  };


}