import mongoose from "mongoose";

import { request , response } from "express";
import { QuizModel } from "../../models/quiz.model.js";
import { UserModel } from "../../models/user.model.js";
import { FavoritesModel } from "../../models/favorites.model.js";

export class CreateFavoriteQuiz {

 
run = async (req = request, res = response) => {

const session = await mongoose.startSession();

try {

const { userId , quizId } = req.body;

session.startTransaction();

const findUserId = await UserModel.findById(userId).lean().session(session);
const findQuiz = await QuizModel.findById(quizId).lean().session(session);
const checkIfUserLikedThisQuiz = await FavoritesModel.findOne({ userId, quizId }).lean().session(session);

if(checkIfUserLikedThisQuiz) {
return res.status(201).json({ ok : false , message : `the user has liked this quiz previously`,  data : [] })
}


if(!findUserId) {
return res.status(300).json({ ok : false , message : `the user ${userId} was'nt found `,  data : [] })
}

if(!findQuiz) {

return res.status(300).json({ ok : false , message : `the quiz ${quizId} was'nt found `,  data : [] })
}

const newFavoriteQuiz = await new FavoritesModel({ userId , quizId } ).save({ session });

await session.commitTransaction();

return res.status(200).json({ok: true , message : `new favorite quizz added` , data : newFavoriteQuiz})


}
catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("createinga favorite quiz error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining the creating a favorite quiz",
        error: e.message
      });

    } 
    finally {
    session.endSession();
    }
}

}