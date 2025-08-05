import { Router } from "express";
import { GetFavoriteQuizzesByUserId } from "../../controllers/public/getFavoritesByUserId.js";
const getFavoritesByUserIdRouter = Router();

const getFavoritesByUserIdController = new GetFavoriteQuizzesByUserId();

getFavoritesByUserIdRouter.get("/my-favorites/:userId" , getFavoritesByUserIdController.run);

export { getFavoritesByUserIdRouter }

