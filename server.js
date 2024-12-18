const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const connectDB = require("./db");
require("dotenv").config();
const User = require("./schema");
const port = process.env.PORT || 3000;
connectDB();

app.post("/submit", async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error saving data ", err);
    res.status(500).json({ error: "Failed to save user data" });
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid Id format" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);

    res.json({
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    // if(error.kind === 'ObjectId'){
    //     // return res.status(400).json({error: 'Invalid id format'})
    // }
    res
      .status(500)
      .json({ message: "Failed to fetch user data", error: error.message });
  }
});

app.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const updateFields = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid Id format" });
  }
  try {
    const updateUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", data: updateUser });
  } catch (error) {
    console.error("Error updating user: ", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});


    app.delete('/delete/:id',async(req,res)=>{
        const userId = req.params.id
        const fieldToDelete = req.body.field
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(200).json({message: "Invalid id format"})
        }

        try{
            if(fieldToDelete){
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$unset: {[fieldToDelete]:""}},
                    {new: true}
                )
                if(!updatedUser){
                    return res.status(404).json({message: 'User not found'})
                }
                return res.status(200).json({message: `Field ${fieldToDelete} deleted successfully`,data: updatedUser})
            }
            else{
                const deletedUser = await User.findByIdAndDelete(userId)

                if(!deletedUser){
                    return res.status(404).json({message: `User not found`})
                }
                return res.status(200).json({message: `User deleted successfully`,data: deletedUser})
            }

        }catch(error){
            console.error("Error deleting user or field",error)
            res.status(500).json({message: `Error deleting user or field`,error: error.message})
        }
    })

app.listen(port, () => [console.log(`Server is running on port ${port}`)]);
