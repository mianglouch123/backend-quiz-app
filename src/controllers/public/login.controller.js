import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { response, request } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user.model.js";



export class LoginController {
constructor() {}

run = async (req = request , res = response) => {
const session = await mongoose.startSession();

try {

const {username , password} = req.body;

 if (!username || !password) {
      return res.status(400).json({ ok: false, message: "No data sent", data: null });
    }
  
 session.startTransaction();

const findUser = await UserModel.findOne({username}).session(session).lean();

if(!findUser) {
return res.status(400).json({ ok: false, message: "The user was'nt found", data: null });

}

const comparePassword = bcrypt.compareSync(password , findUser.password);

if(!comparePassword) {
return res.status(400).json({ ok: false, message: "The user was'nt found", data: null });
}
 const token = jwt.sign({ userId: findUser._id }, process.env.JWT_KEY);



 await session.commitTransaction();
 return res.status(200).json({ ok: true, message: "Login sucessfully", 
 data: token , user :findUser});
 



}

catch(e) {
if(session.inTransaction()) {
await session.abortTransaction();
}
 console.log(e)
 return res.status(500).json({ ok: false, message: "Internal error at the moment to login the user", data: null });
}

finally {
 session.endSession();
}

}

}