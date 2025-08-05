import mongoose from "mongoose";
const { Schema } = mongoose;

const favoritesSchema = new Schema({
  quizId: { type : Schema.ObjectId , ref : "Quiz" },
  userId : { type : Schema.ObjectId , ref : "User" }
  
})

export const FavoritesModel = mongoose.model("Favorites" , favoritesSchema);