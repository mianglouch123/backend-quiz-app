import { Router } from "express";
import { DeleteFavoriteQuiz } from "../../controllers/public/deleteFavoriteQuiz.controller.js";
const deleteFavoriteQuizRouter = Router();
const deleteFavoriteQuizController = new DeleteFavoriteQuiz();

deleteFavoriteQuizRouter.delete("/delete-favorite-quiz/" , deleteFavoriteQuizController.run);

export { deleteFavoriteQuizRouter }