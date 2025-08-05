import { Router } from "express";
import { GetTotalUsersByGameId } from "../../controllers/public/getTotalUsersByGameId.js";
const getTotalUsersByGameIdRouter = Router();
const GetTotalUsersByGameIdController = new GetTotalUsersByGameId();

getTotalUsersByGameIdRouter.get("/getTotalUsersByGameId/:id" , GetTotalUsersByGameIdController.run);

export { getTotalUsersByGameIdRouter }
