const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const connectDB = require('./db')
require('dotenv').config()
const User = require('./schema')
const port = process.env.PORT || 3000
connectDB()

app.post("/submit",async (req, res) => {
    try{ 
    const user = new User({
    name: req.body.name,
    reg_no: req.body.reg_no,
    email: req.body.email,
  });


  if (!user.name || !user.reg_no || !user.email) {
    return res.status(400).json({
      error: "Please provide all the details correctfully",
    });
  }
  console.log("User data received: ", user);

  const savedUser = await user.save();
  res.json({
    message: "Data Received",
    user: savedUser,
  });
}catch(err){
    console.error('Error saving data ',err)
    res.status(500).json({error: 'Failed to save user data'})
}
});


app.get('/user/:id',async(req,res)=>{
    try{
        const userId = req.params.id
        const user = await User.findByID(userId)

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        console.log(user)
        
        res.json({
            message: 'User data fetched successfully',
            data: user
        })
    }catch(err){
        console.error(`Error fetching data: ${err}`);
        if(error.kind === 'ObjectId'){
            return res.status(400).json({error: 'Invalid id format'})
        }
        res.status(500).json({err: 'Failed to fetch user data'})
    }
})

app.listen(port, () => [console.log(`Server is running on port ${port}`)]);
