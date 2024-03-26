import mongoose from 'mongoose';

//fruitSchema
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  readyToEat: {
    type: Boolean,
    required: true,
  },
});



export default mongoose.model('Fruits', fruitSchema);
