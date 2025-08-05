import { Router } from "express";
import { RegisterController } from "../../controllers/public/register.controller.js";
const registerRouter = Router();

const registerController = new RegisterController();

registerRouter.post("/register" , registerController.run);

export {

registerRouter

}