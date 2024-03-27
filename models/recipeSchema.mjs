import mongoose from 'mongoose';

//recipeSchema
const recipeSchema = new mongoose.Schema({
  
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
const Recipes = mongoose.model('Recipes', recipeSchema);
export default Recipes 