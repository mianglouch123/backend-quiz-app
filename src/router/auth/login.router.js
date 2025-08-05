import { Router } from "express";
import { LoginController } from "../../controllers/public/login.controller.js";
const loginRouter = Router();

const loginController = new LoginController();


loginRouter.post("/login" , loginController.run);

export {
loginRouter
}

