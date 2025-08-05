import "dotenv/config";

export class SystemEnv{
/**@type {Number} */
API_PORT;

static #instance

constructor() {
this.API_PORT = Number(process.env.API_PORT);
}

static getInstance() {
 if(!this.#instance) {
  this.#instance = Object.freeze(new SystemEnv())
 }
return this.#instance;
}


}