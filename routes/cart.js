const router = require("express").Router();
const User= require("../models/user");
const {authenticateToken}=require("./userAuth");

//put book to cart

router.put("/add-book-to-cart", authenticateToken,  async(req, res)=>{
  try{
        const {bookid , id}=req.headers;
        const userData=await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if(isBookInCart){
            return res.status(200).json({message:"Book is already in cart"})
        }
        await User.findByIdAndUpdate(id, {$push:{cart:bookid}});
        return res.status(200).json({message:"Book Added to Cart "});
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
});

//remove book from cart

router.put("/remove-from-cart/:bookid", authenticateToken,  async(req, res)=>{
  try{
        const {bookid}=req.params;
        const {id}=req.headers;
        const userData=await User.findById(id);
        await User.findByIdAndUpdate(id, {$pull:{cart:bookid}});
        return res.status(200).json({message:"Book removed from cart"});
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
});

//get a cart of particular user

router.get("/get-cart", authenticateToken,  async(req, res)=>{
  try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate("cart");
        
        const cart=userData.cart.reverse();
        if(cart){
        return res.status(200).json(cart);
        }else{
          return res.status(404).json({message:"Cart is empty"})
        }
  }catch(error){
    console.log(error)
    return res.status(500).json({message:"Internal server error"})
  }
});
module.exports=router;