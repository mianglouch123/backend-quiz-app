import { Router } from "express";
import { CheckQuizLikedByUserId } from "../../controllers/public/checkQuizLikedByUserId.js";
const checkQuizLikedByUserIdRouter = Router();

const checkQuizLikedByUserIdController = new CheckQuizLikedByUserId();

checkQuizLikedByUserIdRouter.get("/check-quiz-liked-by-userId" , checkQuizLikedByUserIdController.run);

export { checkQuizLikedByUserIdRouter };