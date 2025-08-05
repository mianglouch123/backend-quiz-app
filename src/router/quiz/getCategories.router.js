import { Router } from "express";
import { GetCategoriesController } from "../../controllers/public/getCategories.controller.js";
const getCategoriesRouter = Router();

const getCategoriesController = new GetCategoriesController();

getCategoriesRouter.get("/get-categories" , getCategoriesController.run);

export { getCategoriesRouter };