import { Router } from "express";
import { ResetQuizScoreById } from "../../controllers/public/resetquizscoreByid.controller.js";
const resetQuizScoreByIdRouter = Router();

const resetQuizScoreController = new ResetQuizScoreById();

resetQuizScoreByIdRouter.patch("/quiz/:quizId/restart" , resetQuizScoreController.run)

export { resetQuizScoreByIdRouter }