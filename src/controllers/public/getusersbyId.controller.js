import mongoose from "mongoose";
import { response , request } from "express";
import { UserModel } from "../../models/user.model.js";

export class GetUsersByIdController {
  constructor() {}

  run = async (req = request, res = response) => {
    const session = await mongoose.startSession();
    try {
     
      const { users } = req.body;
      if (!Array.isArray(users)) {
        return res.status(400).json({ ok: false, message: "No array sended", data: null });
      }
     
     session.startTransaction();

    let aggUsers = await UserModel.aggregate([
   
    { $match : { _id : { $in : users.map(id => new mongoose.Types.ObjectId(id)) } } },
    {
    $project : {
     _id : 1,
     username : 1
    }
    }

])

     

      await session.commitTransaction();

      return res.status(200).json({ ok: true, message: "Users sent", data: aggUsers });
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      console.error("Error getting users:", e);
      return res.status(500).json({ ok: false, message: "Internal error obtaining the users", error: e.message });
    } finally {
      session.endSession();
    }
  };
}
