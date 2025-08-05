import mongoose from "mongoose";
import { request , response } from "express";
import { AttempModel } from "../../models/attemp.model.js";


export class GetAttempUserIdByQuizId {
run = async (req = request,  res = response) => {


const session = await mongoose.startSession();
 
try {

const { userId , quizId } = req.query;
const page = req.query.page || 1;
const limit = 5;
const skip = parseInt((page - 1) * limit);

session.startTransaction();

const attemps = await AttempModel.aggregate([
  {
    $match: {
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(userId),
      score: { $gt: 0 }
    },
},
  
  {
    $group: {
      _id: "$score",
      totalScores: { $sum: "$score" },
      quizId: { $first: "$quizId" } ,
      playedAt : { $first : "$playedAt" }
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
  {
    $unwind: "$quiz"
  },
  {
    $project: {
      _id: 1,                        // que sigue siendo el score
      playedAt : 1,    
      totalScores: 1,
      quizId: 1,
      quizTitle: "$quiz.title",      // o cualquier campo que quieras traer
}
  },
  { $sort : { score : -1 } },
  { $skip:  skip },
  { $limit: limit }

]).session(session);


const totalTries = await AttempModel.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      quizId: new mongoose.Types.ObjectId(quizId)
    }
  },
  {
    $group: {
      _id: "$quizId",
      tries: { $sum: 1 },
      lastPlayedAt: { $max: "$playedAt" },
      totalScore: { $sum: "$score" },
      maxScore : { $max : "$score" },
      minScore : { $min : "$score" },
    }
  },
  {
    $lookup: {
      from: "quizzes",
      localField: "_id",
      foreignField: "_id",
      as: "quiz"
    }
  },
  { $unwind: "$quiz" },
  {
    $project: {
      _id: 0,
      quizId: "$_id",
      quizTitle: "$quiz.title",
      tries: 1,
      maxScore : 1,
      lastPlayedAt: 1,
      totalScore: 1,
      minScore : 1,
    }
  },
]);
   


await session.commitTransaction();



return res.status(200).json({
 ok : true,
 message : `The attemps of quiz by id: ${quizId} , from user with id: ${userId} sent`,
 data : {
 attemps,
 totalTries
}

 })


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