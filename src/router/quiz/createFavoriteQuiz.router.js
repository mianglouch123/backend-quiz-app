import { Router } from "express";
import { CreateFavoriteQuiz } from "../../controllers/public/createFavoriteQuiz.controller.js";
const createFavoriteQuizRouter = Router();
const createFavoriteQuizController = new CreateFavoriteQuiz()
createFavoriteQuizRouter.post("/add-favorite-quiz" , createFavoriteQuizController.run);

export { createFavoriteQuizRouter }

