import { AppServer } from "./server/app.server.js";
import { MongooseDb } from "./database/mongoose.db.js";
const appServer = new AppServer();
const mongooseDb = MongooseDb.getInstance();

const boostrap = () =>  {
mongooseDb.connection();


appServer.start()

console.log("connected to app server");

}


boostrap();

