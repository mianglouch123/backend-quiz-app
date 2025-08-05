import mongoose from "mongoose";
import { request, response } from "express";
import { UserModel } from "../../models/user.model.js";
import { AttempModel } from "../../models/attemp.model.js";
import { QuizModel } from "../../models/quiz.model.js";

export class GetUserByIdController {
  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();
    try {
      const { userId } = req.params

      if (!userId) {
        return res.status(400).json({ ok: false, message: "No userId provided", error: null });
      }

      session.startTransaction();

      const findUser = await UserModel.findById(userId).select("-password -quizzes").
      lean().session(session);   
      if (!findUser) {
        await session.abortTransaction();
        return res.status(404).json({ ok: false, message: "User not found", error: null });
      }


     const quizzesByUser = await QuizModel.aggregate([
     { $match : { userId : new mongoose.Types.ObjectId(userId) } },
     {
     $project : {
     _id : 1,
     title : 1
     }
     }
     
    ])

    const attempsByUser = await AttempModel.aggregate([
    { $match : { 
    userId : new mongoose.Types.ObjectId(userId) , 
    score : { $gt : 0 }} },
    { 
     $group : {
     _id : "$quizId",
     totalAttempsDone: { $sum: 1 },
     quizId : { $first : "$quizId" },
     }
    },
    {
    $lookup : {
    from : "quizzes",
    localField : "quizId",
    foreignField : "_id",
    as : "quiz"

    }
    },
    { $unwind : "$quiz" },
    {
    $project : {
    _id : 1,
    totalScores : 1,
    quizId : 1,
    quizTitle : "$quiz.title"
   
    }
    }
    
   ])



      await session.commitTransaction();
      return res.status(200).json({
        ok: true,
        message: "User info sent",
        data: {
          user: findUser,
          quizzesByUser,
          attempsByUser,
        },
      });
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("Error getting user data:", e);
      return res.status(500).json({ ok: false, message: "Internal error obtaining the user data", error: e.message });
    } finally {
      session.endSession();
    }
  };
}
