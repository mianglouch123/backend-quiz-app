import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { response, request } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../../models/user.model.js";

export class RegisterController {

  constructor() {}

run = async (req = request , res = response) => {
  const session = await mongoose.startSession();

  try {
    const { username, password } = req.body; 

    if (!username || !password) {
      return res.status(400).json({ ok: false, message: "No data sent", data: null });
    }

    // Arranca la transacción lo antes posible
    session.startTransaction();

    let user = await UserModel.findOne({ username }).session(session).lean();

    if (user) {
      await session.abortTransaction();
      return res.status(400).json({ ok: false, message: "The user already exists", data: null });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save({ session });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);

    await session.commitTransaction();
    return res.status(201).json({ ok: true, message: "User created successfully", data: token });

  } catch (e) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
     console.log(e)
    return res.status(500).json({ ok: false, message: "Internal error at the moment register user", data: null });
  } finally {
    session.endSession();
  }
};


  
}
