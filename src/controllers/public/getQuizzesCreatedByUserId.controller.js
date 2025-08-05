import mongoose from "mongoose";
import { request , response } from "express";
import { QuizModel } from "../../models/quiz.model.js";

export class GetQuizzesCreatedByUserId {

run = async (req = request , res = response) => {

const session = await mongoose.startSession();

try {

const { userId } = req.query

session.startTransaction();

const quizzes = await QuizModel.aggregate([
{ $match : { userId : new mongoose.Types.ObjectId( userId )}},
{
 $lookup : {
  from : "users",
  localField : "userId",
  foreignField : "_id",
  as : "user",
}
},
{ $unwind : "$user" },
{

 $project : {
 _id: 0,
 id : "$_id",
 quizTitle : "$title",
 username : "$user.username"

}

}

])

await session.commitTransaction();

return res.status(200).json({ 
  message : `quizzes created by user with id:${userId} sent`,
  data : quizzes
 })

 
}
catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetQuizzesCreatedByUserId error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the quizzes don by user id",
        error: e.message
      });

    } finally {
      session.endSession();
    }

}

}