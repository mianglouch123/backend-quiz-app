import express from "express";
import { appRouter } from "../router/app.router.js";
import cors from "cors";
import { Router } from "express";
import { SystemEnv } from "../enviorments/system.env.js";
export class AppServer {
 /**@type {express.Application} */
#app


#systemEnv;

constructor() {
this.#app = express();
this.#systemEnv = new SystemEnv();
this.#middlewares();
this.#loadrouters();   

}

#middlewares() {
this.#app.use(express.json());
this.#app.use(express.urlencoded({extended : true}));
this.#app.use(cors({
origin : "http://localhost:5173",
credentials : true,
methods : ["GET" , "POST" , "DELETE" , "PATCH" , "PUT"],

}))
}

#loadrouters() {
const router = Router();
router.use(appRouter)
this.#app.use(router);

}

start() {

const {API_PORT} = this.#systemEnv;

console.log(API_PORT)

this.#app.listen(API_PORT , async function() {

try {
console.log("connection suscesfully in " + API_PORT)
}catch(e) {
  console.log("error in connecting in PORT "+  API_PORT + " " + e.name);
}

})


}


}