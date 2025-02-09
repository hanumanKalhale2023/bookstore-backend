const router = require("express").Router();
const User= require("../models/user");
const {authenticateToken}=require("./userAuth");


//add book to favorites
router.put("/add-book-to-favourites", authenticateToken,  async(req, res)=>{
    try{
        const {bookid, id}=req.headers;
        const userData=await User.findById(id);
       const isBookFavorite = userData.favourites.includes( bookid )
       if(isBookFavorite){
        res.status(200).json({message: "Book already in your favourites"});
        return;
       }
       await User.findByIdAndUpdate(id, {$push:{favourites: bookid}});
       return res.status(200).json({message: "Book added to favourites"});
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
});

//remove book from favorites

router.put("/remove-book-from-favourites", authenticateToken,  async(req, res)=>{
    try{
        const {bookid, id}=req.headers;
        const userData=await User.findById(id);
       const isBookFavorite = userData.favourites.includes( bookid )
       if(isBookFavorite){
        await User.findByIdAndUpdate(id, {$pull:{favourites: bookid}});
        return res.status(200).json({message: "Book removed from favourites"});
       }
       else{
        return res.status(404).json({message: "Your book is not in the favorites list"});
       }
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
});

//get particular user's favorites books 
router.get('/get-favourite-books', authenticateToken, async (req, res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate("favourites");
       // console.log(userData);
        
        const favouriteBooks= userData.favourites;
        if(favouriteBooks){
        //console.log(favouriteBooks)
            return res.status(200).json({favourites: favouriteBooks});
        }
        
    }catch(error){
        return res.status(500).json({message: "Internal Server Error",error});
    }
})



module.exports=router;