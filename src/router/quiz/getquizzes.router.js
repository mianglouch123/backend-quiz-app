import { Router } from "express";
import { GetQuizzesController } from "../../controllers/public/getquizzes.controller.js";


const getQuizzesRouter = Router();
const getQuizzesController = new GetQuizzesController();


getQuizzesRouter.get("/get-quizzes" , getQuizzesController.run);


export { getQuizzesRouter };







