import mongoose from "mongoose";
import { response, request } from "express";
import { UserModel } from "../../models/user.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { getPercentBoundaries } from "../../utils/get.percetboundaries.js";
import { AttempModel } from "../../models/attemp.model.js";
export class GetQuizById {

  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();
    try {
      const { quizId } = req.params;
      const { quizInfo } = req.query;

      if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ ok: false, message: `Invalid quizId: ${quizId}` });
      }

      session.startTransaction();

      const quizById = await QuizModel.findById(quizId).session(session).lean();

      if (!quizById) {
        await session.abortTransaction();
        return res.status(404).json({ ok: false, message: `Quiz with id: ${quizId} not found` });
      }

      if (quizInfo !== undefined) {
        // Obtener total de usuarios
    const totalUsersAgg = await AttempModel.aggregate([
     { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
     { $group: { _id: "$userId" } }, 
     { $count: "totalUsers" }        
]);

const totalUsers = totalUsersAgg[0]?.totalUsers || 0;

     
        if (totalUsers === 0) {
          await session.commitTransaction();
          return res.status(200).json({ ok: true, message: "Nobody has done this quiz yet", data: { totalUsers , totalAvg: 0 } });
        }

        // Obtener el promedio de puntaje
        const totalAvgResult = await AttempModel.aggregate([
          {
            $facet: {
              avg: [
                { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
                { $group: { _id: null, totalAvg: { $avg: "$score" } } },
                { $project: { _id: 0, totalAvg: 1 } }
              ]
            }
          }
        ]);

    
    
     const usersWithMoreClasification = await AttempModel.aggregate([
  {
    $match: {
      quizId: new mongoose.Types.ObjectId(quizId),
      score: { $gt: 0 }
    }
  },
  {
    $sort: { userId: 1, score: -1 } 
  },
  {
    $group: {
      _id: "$userId", 
      quizId: { $first: "$quizId" },
      score: { $first: "$score" },
      playedAt: { $first: "$playedAt" },
      attemptId: { $first: "$_id" }
    }
  },
  {
    $sort: { score: -1 } 
  },
  { $limit: 3 },
  {
    $lookup: {
      from: "users",
      localField: "_id",        
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: "$attemptId",
      userId: "$_id",
      quizId: 1,
      score: 1,
      playedAt: 1,
      username: "$user.username"
    }
  }
]);



         

  const clasificationByScores = await AttempModel.aggregate([
  {
    $match: {
      quizId: new mongoose.Types.ObjectId(quizId)
    }
  },
  {
    $sort: { score: -1 }
  },
  {
    $group: {
      _id: "$userId",
      score: { $first: "$score" }
    }
  },
  {
    $bucket: {
      groupBy: "$score",
      boundaries: getPercentBoundaries(), // por ejemplo: [0, 20, 60, 100, 101]
      output: {
        users: { $push: "$_id" } // _id aquí es el userId
      }
    }
  }
]).session(session);


  const usersDoneTheQuiz = await AttempModel.aggregate([
  { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
  { $sort: { playedAt: -1 } },
  {
    $group: {
      _id: "$userId",                 // Agrupamos por usuario
      userId: { $first: "$userId" },  // Redundante, pero si lo necesitas en el output, está bien
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userData"
    }
  },
  { $unwind: "$userData" },
  {
    $project: {
      _id: 0,
      userId: "$userId",
      username: "$userData.username"
    }
  }
]);
        const totalAvg = totalAvgResult[0]?.avg[0]?.totalAvg ?? 0;

        await session.commitTransaction();
        return res.status(200).json({
          ok: true,
          message: `Quiz ${quizId} info sent`,
          data: { totalUsers, totalAvg , clasificationByScores , 
         usersWithMoreClasification , usersDoneTheQuiz}
        });
      }

      // Si no hay quizInfo, enviar el quiz completo
      const quiz = await QuizModel.find({_id : quizId})
        .populate({
          path: "questions",
          populate: {
            path: "options"
          }
        })
        .lean()
        .session(session);

      await session.commitTransaction();

      return res.status(200).json({
        ok: true,
        message: `Quiz ${quizId} sent`,
        data: quiz
      });

    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("Error getting quiz:", e);
      return res.status(500).json({ ok: false, message: "Internal error obtaining the quiz", error: e.message });
    } finally {
      session.endSession();
    }
  };
}



