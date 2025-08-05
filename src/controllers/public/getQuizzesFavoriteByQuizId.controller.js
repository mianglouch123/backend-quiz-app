import mongoose from "mongoose";
import { request , response } from "express";
import { QuizModel } from "../../models/quiz.model.js";
import { FavoritesModel } from "../../models/favorites.model.js";
export class GetQuizzesFavoriteByQuizId {

run = async (req = request , res = response) => {

const session = await mongoose.startSession();


try {

const { quizId } = req.params

session.startTransaction();

const findQuiz = await QuizModel.findById(quizId).lean().session(session);

if(!findQuiz) {
return res.status(300).json({ ok : false , message : `the quiz ${userId} was'nt found `,  data : [] })
}


const quizzesFavoritesByQuizId = await FavoritesModel.aggregate([

  {
	$match: {
	  quizId: new mongoose.Types.ObjectId(quizId)
	}
  },

  {
	$lookup: {
	  from: "users",
	  localField: "userId",
	  foreignField: "_id",
	  as: "user"
	}
  },

  {
	$unwind: "$user"
  },

  {
	$project: {
	  _id: 0,
      quizId : "$quizId",
      username : "$user.username"  
	}
  }

]).session(session);


await session.commitTransaction();

  return res.status(200).json({
        ok: true,
        message: `the favorite quizzes by quiz Id: ${quizId} was sent`,
        data : quizzesFavoritesByQuizId
      });

}

catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("GetQuizzesFavoritesById quiz error:", e);
      return res.status(500).json({
        ok: false,
        message: "Internal error obtaining at the moment to getting favorite quiz by id",
        error: e.message
      });

    } 
    finally {
    session.endSession();
    }

}

}