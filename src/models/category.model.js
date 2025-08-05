import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
  categoryName: { type: String, required: true, unique: true }
})

export const CategoryModel = mongoose.model("Category" , categorySchema);


