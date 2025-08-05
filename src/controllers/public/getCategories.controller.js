import mongoose, { mongo } from "mongoose"
import { request , response } from "express";
import { CategoryModel } from "../../models/category.model.js";

export class GetCategoriesController {

constructor() {}

run = async (req  = request , res = response) => {

const session = await mongoose.startSession();


try {

const { id } = req.query;

session.startTransaction()

if(id) {
const categoryById = await CategoryModel.findById(id).lean().session(session);

if(!categoryById) {

return res.status(400).json({ ok : false , message : "Category by id was'nt found" , data : null})

}

await session.commitTransaction();

return res.status(200).json({ ok : false , message : `Category by id ${id} sended ` , data : categoryById});

}

const categories = await CategoryModel.find({}).lean().session(session);

await session.commitTransaction();

return res.status(200).json({ ok : false , message : `Categories sended ` , data : categories});

}

catch(e) {

if(session.inTransaction()) {

await session.abortTransaction();

}

console.error("Error deleting quiz:", e);
return res.status(500).json({ ok: false, message: "Internal error getting the categories ", error: e.message });
}

finally {

session.endSession();

}

}


}