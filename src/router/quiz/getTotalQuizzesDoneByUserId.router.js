import { Router } from "express";
import { GetTotalQuizzesDoneByUserId } from "../../controllers/public/getTotalQuizzesDoneByUserId.controller.js";

const getTotalQuizzesDoneByUserIdRouter = Router();

const getTotalQuizzesDoneByUserIdController = new GetTotalQuizzesDoneByUserId();

getTotalQuizzesDoneByUserIdRouter.get("/get-total-quizzes-done-by-user-id", getTotalQuizzesDoneByUserIdController.run);

export { getTotalQuizzesDoneByUserIdRouter }