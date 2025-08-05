import { Router } from "express";
import { DeleteQuizController } from "../../controllers/public/deletequiz.controller.js";

const deleteQuizRouter = Router();
const deleteQuizController = new DeleteQuizController();

deleteQuizRouter.delete("/delete-quiz/:quizId" , deleteQuizController.run);

export {
deleteQuizRouter
}