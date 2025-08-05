import mongoose from "mongoose";
import { request , response } from "express";
import { QuizModel } from "../../models/quiz.model.js";
import { AttempModel } from "../../models/attemp.model.js";
export class GetTotalUsersByGameId {


run = async (req = request , res = response) => {

const session = await mongoose.startSession();
const { id } = req.params;
const { page } = req.query;

try {


session.startTransaction();


const findQuizId = await QuizModel.exists({_id : id}).session(session);

if(!findQuizId) {

return res.status(404).json({ ok: false, message: "Quiz not found" });

}

const limit = 5;
const page = parseInt(req.query.page) || 1;
const skip = (page - 1) * limit;

const users = await AttempModel.aggregate([
  {
    $match: {
      quizId: new mongoose.Types.ObjectId(id)
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData"
    }
  },
  {
    $unwind: "$userData"
  },
  {
    $group: {
      _id: "$userData._id",
      username: { $first: "$userData.username" },
      attemptsCount: { $sum: 1 }
    }
  },
  { $sort: { score: -1 } },
  { $skip: skip },
  { $limit: limit }
]).session(session);




await session.commitTransaction();

return res.status(200).json({ok : true , message : "users obteined sucessfully" , data : users})

}
catch(e) {
 if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetTotalUsersByGameId error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the total users by game id",
        error: e.message
      });
}
finally {
await session.endSession();
}

}

}