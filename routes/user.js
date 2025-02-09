const router = require("express").Router();
const User= require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./userAuth");

// signup route
router.post("/signup", async (req, res) => {
    try{
        const {username, email, password, address}=req.body;
        // validate inputs
        if(!username ||!email ||!password ||!address){
            return res.status(400).json({ message: "All fields are required" });
        }
        // check if username is greater than 4 characters
        if(username.length < 4){
            return res.status(400).json({ message: "Username must be at least 4 characters long" });
        }

        // check username is already exist.

        const exitingUsername = await User.findOne({ username: username});
        if(exitingUsername){
            return res.status(400).json({ message: "Username already exists" });
        }

        // check email is already exist.
        const exitingEmail = await User.findOne({ email: email});
        if(exitingEmail){
            return res.status(400).json({ message: "Email already exists" });
        }
        //check password length is greater than 5 characters
        if(password.length < 5){
            return res.status(400).json({ message: "Password must be at least 5 characters long" });
        }
        //convert password to bcrypt password
        const hashedPassword=await bcrypt.hash(password, 10)
        //create new user
        const newUser = new User({
            username:username,
            email:email,
            password:hashedPassword,
            address:address,
        })
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

// sign in route
router.post("/signin", async (req, res) => {
    try{
        const { username, password}=req.body;
        const existingUser = await User.findOne({username})
        if(!existingUser)
        {
            return res.status(404).json({ message: "Invalid credential" });
        }
        
         await bcrypt.compare(req.body.password, existingUser.password, (err,data)=>{
            if(data){
                const authClaims=[
                    { name:existingUser.username},
                    {role:existingUser.role},
                ]
                const token = jwt.sign({authClaims }, "bookstore@123", { expiresIn: '30d' });
                res.json({ id:existingUser._id,
                    role: existingUser.role,
                    token:token 
                 });
            }
            else{
                res.status(400).json({ message: "Invalid credential" });
            }
         });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

//get user information
router.get('/user-info',authenticateToken, async (req,res) => {
    try{
        
        const {id}=req.headers;
        // find user by id
        const data= await User.findById(id).select("-password");
        
        return res.status(200).json(data);

    }catch(err){
        res.status(500).json({ message: "Internal server error" });
    }

});

//update user Address.
router.put("/update-address", authenticateToken, async (req,res) => {
    try{
        const {id}=req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id, {address:address})
        res.status(200).json({message:"address updated successfully"});
    }catch(err){
        res.status(500).json({ message: "Internal server error" });
    }
    })
module.exports = router;