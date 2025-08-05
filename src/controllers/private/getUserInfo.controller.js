import mongoose from "mongoose";
import { request , response} from "express";
import { UserModel } from "../../models/user.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { AttempModel } from "../../models/attemp.model.js";

export class GetUserInfoController {

run = async (req = request , res = response) => {

const session = await mongoose.startSession();

try {

const { userId } = req.params;

session.startTransaction();

	const user = await UserModel.findOne({ _id : new mongoose.Types.ObjectId(userId) }).session(session).lean();
	if (!user) {
		return res.status(400).json({ ok: false, message: "User not found", data: null });
	}
  const limit = 5;
  const page = req.query.page || 1;
  const skip = parseInt((page - 1) * limit);


  const quizzesDoneByUser = await QuizModel.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
    },
  },
  {
    $lookup: {
      from: "categories",
      let: { ids: "$categoryIds" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$ids"] },
          },
        },
      ],
      as: "categoriesMatched",
    },
  },
  {
    $lookup: {
      from: "favorites",
      let: { quizId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$quizId", "$$quizId"] },
          },
        },
      ],
      as: "userLikes",
    },
  },
  {
    $project: {
      quizId: "$_id",
      title: 1,
      categories: "$categoriesMatched.categoryName",
      totalLikes: { $size: "$userLikes" },
      likedBy: "$userLikes.userId", // array de usuarios que le dieron like
    },
  },
  { $skip:  skip },
  { $limit: limit } 


]).session(session);

const quizzesPlayed = await AttempModel.aggregate([
  { 
    $match: { 
      userId: new mongoose.Types.ObjectId(userId) 
    } 
  },
  {
    $group: {
      _id: "$quizId",
      totalScore: { $sum: "$score" },
      timesPlayed: { $sum: 1 },
      betScore: { $max: "$score" },
      minScore: { $min: "$score" },
    }
  },
  {
    $lookup: {
      from: "quizzes",
      localField: "_id",
      foreignField: "_id", // usa _id del modelo Quiz
      as: "quiz",
    }
  },
  { $unwind: "$quiz" },
  {
    $project: {
      _id: 0,
      quizId: "$quiz._id",
      title: "$quiz.title",
      totalScore: 1,
      timesPlayed: 1,
      betScore: 1,
      minScore: 1
    }
  },
  { $skip:  skip },
  { $limit: limit }
]).session(session);


const totalScoreSumByAllQuizzesDone = quizzesPlayed.reduce((sum, quiz) => sum + quiz.totalScore, 0);

const resultAvgs = await AttempModel.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $facet: {
      avgByQuiz: [
        {
          $group: {
            _id: "$quizId",
            avgScore: { $avg: "$score" }
          }
        },
    {
    $lookup : {
    from : "quizzes",
    localField : "_id",
    foreignField : "_id",
    as : "quiz"
    },
    },
    { $unwind : "$quiz" },
    { $sort : { avgScore : -1 } },
    { $skip: skip },               // por ejemplo, salta los primeros 10
    { $limit: limit },
    {
      $project : {
       id : 1,
       avgScore : 1,
       title : "$quiz.title"
      }
      }       
      ],
      avgGeneral: [
        {
          $group: {
            _id: null,
            avgScore: { $avg: "$score" }
          }
        }
      ]
    }
  }
]);

const { avgByQuiz, avgGeneral } = resultAvgs[0];

const userName = await UserModel.findOne({_id : new mongoose.Types.ObjectId(userId)}).lean().session(session).select("-password -quizzes");

const totalQuizzesMade = await QuizModel.countDocuments({ userId : new mongoose.Types.ObjectId(userId) }).lean().session(session);

await session.commitTransaction();

return res.status(200).json({
ok : true,
message : "data info user sent",
data : {
quizzesDoneByUser,
quizzesPlayed,
totalScoreSumByAllQuizzesDone,
avgByQuiz,
avgGeneral,
userName,
totalQuizzesMade
}

})

}
catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetUserInfoController error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the user info",
        error: e.message
      });

    } finally {
      session.endSession();
    }

}

}