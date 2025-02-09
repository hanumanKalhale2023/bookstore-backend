const router = require("express").Router();
const User= require("../models/user");
const {authenticateToken}=require("./userAuth");
const Book=require("../models/book");
const Order=require("../models/order");

//place order
router.post("/place-order",authenticateToken, async (req,res)=>{
    try{
        const {id}=req.headers;
        const {order}=req.body;
        for(const orderData of order){
            const newOrder = new Order({user:id, book:orderData._id})
            const orderDataFromDB=await newOrder.save();
            await User.findByIdAndUpdate(id,{$push:{orders:orderDataFromDB._id},});
            await User.findByIdAndUpdate(id,{$pull:{cart:orderData._id},});
        }
        return res.status(200).json({message:"Order placed successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
});

//get order history of a particular user;

router.get("/order-history", authenticateToken, async (req,res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate({
            path:'orders',
            papulate:{path:'book'},
        });
        const ordersData=userData.orders.reverse();
        return res.status(200).json(ordersData);
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
});

//get all orders ---admin

router.get("/all-orders", authenticateToken, async (req,res)=>{
    try{
        const ordersData=await Order.find()
        .populate({
            path:'book',
        })
        .populate({
            path:'user',
        })
        .sort({createdAt:-1});
        return res.status(200).json(ordersData);
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
});

//update order---admin

router.put("/update-order/:id", authenticateToken, async (req,res)=>{
    try{
        const {id}=req.params;
        const {status}=req.body;
        await Order.findByIdAndUpdate(id, {status:status});
        return res.status(200).json({message:"Order status updated successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
});

module.exports=router;