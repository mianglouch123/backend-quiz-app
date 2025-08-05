import { Router } from "express";
import { GetQuizById } from "../../controllers/public/getquizByid.controller.js";
const getQuizByIdRouter = Router();
const getQuizByIdController = new GetQuizById();


getQuizByIdRouter.get("/get-quiz/:quizId" , getQuizByIdController.run);


export {

getQuizByIdRouter

}



