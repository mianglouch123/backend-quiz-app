import { Router } from "express";
import { TakeQuizController } from "../../controllers/public/takequiz.controller.js";


const takeQuizRouter = Router();

const takeQuizController = new TakeQuizController();

takeQuizRouter.post("/take-quiz" , takeQuizController.run);

export { takeQuizRouter }
