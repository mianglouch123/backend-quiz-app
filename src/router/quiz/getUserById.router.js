import { Router } from "express";
import { GetUserByIdController } from "../../controllers/public/getUserById.controller.js";
const getUserByIdRouter = Router();

const getUserByIdController = new GetUserByIdController();

getUserByIdRouter.get("/get-user/:userId" , getUserByIdController.run);

export { getUserByIdRouter }