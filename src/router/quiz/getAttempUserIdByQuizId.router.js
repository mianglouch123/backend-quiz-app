import { Router } from "express";
import { GetAttempUserIdByQuizId } from "../../controllers/public/getAttempUserIdByQuizId.controller.js";

const getAttempUserIdByQuizIdRouter = Router();

const getAttempUserIdByQuizIdController = new GetAttempUserIdByQuizId();

getAttempUserIdByQuizIdRouter.get("/attemps-by-quizId-userId" , getAttempUserIdByQuizIdController.run);

export { getAttempUserIdByQuizIdRouter };