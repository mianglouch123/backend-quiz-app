import { Router } from "express";
import { GetQuizzesCreatedByUserId } from "../../controllers/public/getQuizzesCreatedByUserId.controller.js";
const getQuizzesCreatedByUserIdRouter = Router();

const getQuizzesCreatedByUserIdController = new GetQuizzesCreatedByUserId();

getQuizzesCreatedByUserIdRouter.get("/get-quizzes-created-by-user" , getQuizzesCreatedByUserIdController.run);

export { getQuizzesCreatedByUserIdRouter };

