import { Router } from "express";
import { GetUserInfoController } from "../../controllers/private/getUserInfo.controller.js";
const getUserInfoRouter = Router();
const getUserInfoController = new GetUserInfoController();


getUserInfoRouter.get("/get-user-info-by-id/:userId" , getUserInfoController.run);

export { getUserInfoRouter };
