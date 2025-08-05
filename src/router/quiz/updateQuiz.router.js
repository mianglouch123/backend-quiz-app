import { Router } from "express";
import { UpdateQuizController } from "../../controllers/public/updateQuiz.controller.js";



const updateQuizRouter = Router();
const updateQuizController = new UpdateQuizController();

updateQuizRouter.put("/update-quiz", updateQuizController.run);


export { updateQuizRouter };

