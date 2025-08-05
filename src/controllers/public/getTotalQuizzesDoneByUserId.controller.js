import mongoose from "mongoose";
import { request, response } from "express";
import { AttempModel } from "../../models/attemp.model.js";
export class GetTotalQuizzesDoneByUserId {

run = async ( req  = request , res = response ) => {

const session = await mongoose.startSession()

try {

const { userId , categoryName } = req.query

session.startTransaction();


if(categoryName) {

const normalizedCategory = categoryName.toLowerCase();

const quizzesDoneByCategory = await AttempModel.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $group: {
      _id: "$quizId",
      quizId: { $first: "$quizId" },
      playedAt: { $first: "$playedAt" },
      totalScore: { $sum: "$score" }
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
      let: { categoryIds: "$quiz.categoryIds" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ["$_id", "$$categoryIds"] },
                {
                  $eq: [
                    { $toLower: "$categoryName" },
                    normalizedCategory
                  ]
                }
              ]
            }
          }
        },
        { $project: { _id: 1, categoryName: 1 } }
      ],
      as: "matchedCategories"
    }
  },
  {
    $match: {
      "matchedCategories.0": { $exists: true }
    }
  },
  {
    $project: {
      _id: 0,
      quizId: 1,
      title: "$quiz.title",
      playedAt: 1,
      totalScore: 1,
      categories: "$matchedCategories.categoryName"
    }
  }
]);


await session.commitTransaction();

return res.status(200).json({
ok : true,
message : `get total quizzes done by category ${categoryName} by user with id: ${userId}` , 
data : quizzesDoneByCategory
})

}
else {

const quizzesDone = await AttempModel.aggregate([
  { 
    $match: { userId: new mongoose.Types.ObjectId(userId) } 
  },

  {
    $group: {
      _id: "$quizId",
      quizId: { $first: "$quizId" },
      playedAt: { $first: "$playedAt" },
      totalScore: { $sum: "$score" }
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
      let: { categoryIds: "$quiz.categoryIds" }, 
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$categoryIds"] } 
          }
        },
        {
          $project: {
            _id: 0,
            categoryName: 1
          }
        }
      ],
      as: "matchedCategories"
    }
  },

  {
    $project: {
      _id: 0,
      quizId: 1,
      title: "$quiz.title",
      playedAt: 1,
      totalScore: 1,
      categories: "$matchedCategories.categoryName"
    }
  }
]);




await session.commitTransaction();

return res.status(200).json({
ok : true,
message : `get total quizzes done by user with id: ${userId}` , 
data : quizzesDone
})
}







}

catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error("Error attempUserIdByQuizId:", e);
      return res.status(500).json({ ok: false, message: "Internal error getting attempUserIdByQuizId", error: e.message });
    }finally {
     session.endSession();
    }

}





}