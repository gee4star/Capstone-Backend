// Imports
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Fruits from './models/fruitsSchema.mjs';
import Recipes from './models/recipeSchema.mjs';
import fruits from './utilities/data.js';
import recipes from './utilities/data.js';
import axios from "axios";
import cors from "cors";
import userRoute from './routes/api/users.js';
import authRoute from './routes/api/auth.js';

//Set API Key
const apiKeySpring = process.env.apiKey || "f9cabc1a80b4416eab94bd0e6c909f3b"
const apiKey = apiKeySpring.replace(/"/g, '');


//Configurations
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
await mongoose.connect(process.env.MONGO_URI);



//Middleware
app.use(express.json());
app.use(cors())
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

//TODO Define search input, this comes from frontend 
// let searchInput 

// //POSSIBLE RECOURSE 
// You shouldn't be trying to send data in the body (such as in req.body) through a GET request. That is what a POST request is for.

// With a GET request, you should pass data (such as a user id) as a parameter. Basically, in the url string.

// FRONTEND

// axios.get("/convertedAmount/USD/GBP/1")
// BACKEND

// app.get("/convertedAmount/:primaryCurrency/:secondaryCurrency/:primaryCurrencyAmount", (req, res)=>{
//     console.log(req.params.primaryCurrency);
//     console.log(req.params.secondaryCurrency);
//     console.log(req.params.primaryCurrencyAmount);
// });
// Alternatively, you could use query strings, which would look like this:

// FRONTEND

// axios.get("/convertedAmount?primaryCurrency=USD&secondaryCurrency=GBP&primaryCurrencyAmount=1")
// BACKEND

// app.get("/convertedAmount*", (req, res)=>{
//     console.log(req.query.primaryCurrency);
//     console.log(req.query.secondaryCurrency);
//     console.log(req.query.primaryCurrencyAmount);
// });

// var q = req.query.q; //Eg: q = "Masks"
// // console.log(req.query)
//   db.collection('Listings').find({
//     itemTitle: q
//   }).toArray((err, result) => {
//     res.render('searchItems.ejs',{
//         Listings: result
//     })
// })

//APi Call to lis tof recipes from third party API
// // https://api.spoonacular.com/recipes/complexSearch

// app.get( '/search', async (req, res) =>  {
//   var queryInput = req.query.q
//   try{
//     // const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${searchInput}`)

//     // res.json(response.data)

//     const allRecipes = await Recipes.find({
//       name: queryInput
//     })
//     res.json(allRecipes)
//   }catch(err){
//     console.error(err);
//     res.status(500).json({ msg: 'Server Error' });
//   }
// }

//Create all the  DB Entries
app.get('/newdb', async (req, res) => {
  await Recipes.deleteMany({});
  await Recipes.create(recipes);

  res.send(`Database Created`);
});


//Get request gets several random recipes 
app.get( '/', async (req, res) => {
  try{
    const response = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&include-tags=vegetarian`)
    console.log("RES DATA", response.data)
    res.json(response.data)
  }catch(err){
    console.error(err);
    res.status(500).json({ msg: 'Get / Server Error' });
  }
})
//Get request gets personal recipes list 
app.get( '/personalrecipes', async (req, res) => {
  try{
    const personalRecipes = await Recipes.find({})
    res.json(personalRecipes)
  }catch(err){
    console.error(err);
    res.status(500).json({ msg: 'Get / Server Error' });
  }
})

//Create
app.post('/', async (req, res) => {
  try {
    let addNewRecipe = new Recipes(req.body);
    await addNewRecipe.save();

    res.json(addNewRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//Update
app.put('/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//Delete
app.delete('/:id', async (req, res) => {
  try {
    await Recipes.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: 'Recipe Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});


//app.get('/', async (req, res) => {
    //   try {
    //     const allFruits = await Fruits.find({});
    //     res.json(allFruits);
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ msg: 'Server Error' });
    //   }
    // });

// )



// let res = fetch(`http://www.omdbapi.com/?apikey=${
//                import.meta.env.VITE_API_Key
//              }&t=${movieTitle}`, 
//              {
//           method: 'GET',
//         })
//           .then( 
//             res => res.json()
//           )
//           .then(data => {
//             console.log(data)
            
//           })
//           .catch(error => {
       
//            console.log(error);
//           })
//         setMovieInfo(res.data)


//Error checking middleware
app.use((err, _req, res, next) => {
  res.status(500).send('Seems like we messed up somewhere...');
});

//Listen
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
