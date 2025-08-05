import { Router } from "express";
import { GetQuizzesFavoriteByQuizId } from "../../controllers/public/getQuizzesFavoriteByQuizId.controller.js";

const getQuizzesFavoriteByQuizIdRouter = Router();
const getQuizzesFavoriteByQuizIdController = new GetQuizzesFavoriteByQuizId()

getQuizzesFavoriteByQuizIdRouter.get("/get-favorite-quizzes-by-id/:quizId" , getQuizzesFavoriteByQuizIdController.run)

export { getQuizzesFavoriteByQuizIdRouter }

