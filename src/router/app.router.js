import Router from "express";

import { AunthenticateMiddleware } from "../middlewares/authenticate.middleware.js";
import { registerRouter } from "./auth/register.router.js";
import { loginRouter } from "./auth/login.router.js";
import { createQuizRouter } from "./quiz/createquiz.router.js";
import { deleteQuizRouter } from "./quiz/deletequiz.router.js";
import { getQuizByIdRouter } from "./quiz/getquizbyid.router.js";
import { resetQuizScoreByIdRouter } from "./quiz/resetquizscoreByid.router.js";
import { takeQuizRouter } from "./quiz/takequiz.router.js";
import { getQuizzesRouter } from "./quiz/getquizzes.router.js";
import { getUsersByIdRouter } from "./quiz/getUsersById.router.js";
import { getUserByIdRouter } from "./quiz/getUserById.router.js";
import { updateQuizRouter } from "./quiz/updateQuiz.router.js";
import { getCategoriesRouter } from "./quiz/getCategories.router.js";
import { getTotalUsersByGameIdRouter } from "./quiz/getTotalUsersByGameId.router.js";
import { getAttempUserIdByQuizIdRouter } from "./quiz/getAttempUserIdByQuizId.router.js";
import { getTotalQuizzesDoneByUserIdRouter } from "./quiz/getTotalQuizzesDoneByUserId.router.js";
import { getQuizzesCreatedByUserIdRouter } from "./quiz/getQuizzesCreatedByUserId.router.js";
import { getFavoritesByUserIdRouter } from "./quiz/getFavoritesByUserId.router.js";
import { createFavoriteQuizRouter } from "./quiz/createFavoriteQuiz.router.js";
import { deleteFavoriteQuizRouter } from "./quiz/deleteFavoriteQuiz.router.js";
import { getQuizzesFavoriteByQuizIdRouter } from "./quiz/getQuizzesFavoriteByQuizId.router.js";
import { checkQuizLikedByUserIdRouter } from "./quiz/checkQuizLikedByUserId.router.js";
import { getUserInfoRouter } from "./user/getUserinfo.router.js";


const appRouter = Router();
const authenticateMiddleware = new AunthenticateMiddleware();


appRouter.use(registerRouter);
appRouter.use(loginRouter);
appRouter.use(authenticateMiddleware.run , createQuizRouter);
appRouter.use(authenticateMiddleware.run , deleteQuizRouter);
appRouter.use(authenticateMiddleware.run , getQuizByIdRouter);
appRouter.use(authenticateMiddleware.run , resetQuizScoreByIdRouter);
appRouter.use(authenticateMiddleware.run , takeQuizRouter);
appRouter.use(authenticateMiddleware.run , getQuizzesRouter);
appRouter.use(authenticateMiddleware.run , getUsersByIdRouter);
appRouter.use(authenticateMiddleware.run , getUserByIdRouter);
appRouter.use(authenticateMiddleware.run , updateQuizRouter);
appRouter.use(authenticateMiddleware.run , getCategoriesRouter);
appRouter.use(authenticateMiddleware.run , getTotalUsersByGameIdRouter);
appRouter.use(authenticateMiddleware.run , getAttempUserIdByQuizIdRouter);
appRouter.use(authenticateMiddleware.run , getTotalQuizzesDoneByUserIdRouter)
appRouter.use(authenticateMiddleware.run , getQuizzesCreatedByUserIdRouter);
appRouter.use(authenticateMiddleware.run , getFavoritesByUserIdRouter);
appRouter.use(authenticateMiddleware.run , createFavoriteQuizRouter);
appRouter.use(authenticateMiddleware.run , deleteFavoriteQuizRouter);
appRouter.use(authenticateMiddleware.run , getQuizzesFavoriteByQuizIdRouter);
appRouter.use(authenticateMiddleware.run , checkQuizLikedByUserIdRouter);
appRouter.use(authenticateMiddleware.run , getUserInfoRouter);


export { appRouter }