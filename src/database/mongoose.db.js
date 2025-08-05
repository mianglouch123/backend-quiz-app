import "dotenv/config";
import mongoose from "mongoose";


export class MongooseDb {


/**@type {MongooseDb} */
static #instance

constructor() {
}

static getInstance() {

if(!this.#instance) {
 this.#instance = Object.freeze(new MongooseDb());
}
return this.#instance;

}


async connection() {
 
try {
 await mongoose.connect(String(process.env.DB_URI));
 console.log("connect db sucessfully")
 
}catch(e) {
 console.log(`error to connect the db ${e.name}`);
}



}

}