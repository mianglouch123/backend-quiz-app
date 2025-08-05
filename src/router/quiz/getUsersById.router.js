import { Router } from "express";
import { GetUsersByIdController } from "../../controllers/public/getusersbyId.controller.js";
const getUsersByIdRouter = Router();
const getUsersByIdController = new GetUsersByIdController();

getUsersByIdRouter.get("/get-users-by-id" , getUsersByIdController.run);

export { getUsersByIdRouter };	

