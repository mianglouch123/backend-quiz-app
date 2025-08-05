import { Router } from "express";
import { CreateQuizController } from "../../controllers/public/createquiz.controller.js";

const createQuizRouter = Router();
const createQuizController = new CreateQuizController();

createQuizRouter.post("/create-quiz" , createQuizController.run);

export {

createQuizRouter
}