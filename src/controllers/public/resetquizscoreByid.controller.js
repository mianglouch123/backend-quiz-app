import mongoose from "mongoose";

import { request , response } from "express";
import { UserModel } from "../../models/user.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { AttempModel } from "../../models/attemp.model.js";


export class ResetQuizScoreById {

run = async (req = request , res = response) => {
 
 const session = await mongoose.startSession();

try {

const {quizId} = req.params
const {userId} = req.body;
 
if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ ok: false, message: `Invalid quizId: ${quizId}` });   
   }

  const user = await UserModel.findById(userId).lean().session(session);
  const quiz = await QuizModel.findById(quizId).lean().session(session);

  if(!quiz) {
  return res.status(400).json({ ok: false, message: `Quiz : ${quizId} was'nt found: ${quizId}` });   
  }

  if(!user) {
  return res.status(400).json({ ok: false, message: `User : ${userId} has'nt done this quiz: ${quizId}` });   
 }

 await AttempModel.deleteMany({userId, quizId}).session(session);
 await session.commitTransaction();
 return res.status(200).json({ ok: true, message: `User : ${userId} deleted his score in quiz: ${quizId} sucessfully` });   


}

catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("Error getting quiz:", e);
      return res.status(500).json({ ok: false, message: "Internal error to reseting the quiz", error: e.message });
    } finally {
      session.endSession();
    }

}

}