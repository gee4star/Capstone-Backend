import mongoose from 'mongoose';

//recipeSchema
const recipeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
    required: true,
  },
  
});

export default mongoose.model('Recipes', recipeSchema);