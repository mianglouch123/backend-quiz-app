import mongoose, { mongo } from "mongoose";

import { request , response } from "express";
import { UserModel } from "../../models/user.model.js";
import { QuizModel } from "../../models/quiz.model.js";
import { FavoritesModel } from "../../models/favorites.model.js";


export class CheckQuizLikedByUserId {

run = async (req = request, res = response) => {

const session = await mongoose.startSession();

try {

const { userId , quizId } = req.query;

session.startTransaction();

const findUserId = await UserModel.findById(userId).lean().session(session);
const findQuiz = await QuizModel.findById(quizId).lean().session(session);

if(!findUserId) {
return res.status(300).json({ ok : false , message : `the user ${userId} was'nt found `,  data : [] })
}

if(!findQuiz) {

return res.status(300).json({ ok : false , message : `the quiz ${quizId} was'nt found `,  data : [] })
}

const checkQuizLiked = await FavoritesModel.findOne({ userId, quizId }).lean().session(session);

await session.commitTransaction();

return res.status(200).json({ 
ok : true ,
message : "response sent",
check : Boolean(checkQuizLiked)
})


}

catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("createinga favorite quiz error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining to check if a quiz exists",
        error: e.message
      });

    } 
    finally {
    session.endSession();
    }

}


}