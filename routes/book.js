const router = require("express").Router();
const User= require("../models/user");
const jwt=require("jsonwebtoken");
const Book=require("../models/book");
const {authenticateToken}=require("./userAuth");


//add book ---Admin

router.post("/addbook", authenticateToken, async (req, res) => {
    try{
        const {id}=req.headers;
        const user=await User.findById(id);
        if(!user || user.role!="admin"){
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        const {title, author, price, description, language, url}=req.body;
        // validate inputs
        if(!title ||!author ||!price ||!description ||!language ||!url){
            return res.status(400).json({ message: "All fields are required" });
        }
        const newBook = new Book({
            title:title,
            author:author,
            price:price,
            description:description,
            language:language,
            url:url,
        })
        await newBook.save();
        res.status(201).json({ message: "Book created successfully" });

    }catch(err){
        res.status(500).json({ message:"Internal Error" });
    }
});


//update book by book id
router.put('/update-book',authenticateToken, async (req,res)=>{
    try{
        const {bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid,{
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            description:req.body.description,
            language:req.body.language,
            url:req.body.url,
        });
        return res.status(200).json({ message: "Book updated successfully" });
    }catch(error){
        return res.status(500).json({ message: "Internal Error" });
    }
});

//delte book --------------------------------Admin

router.delete('/delete-book', authenticateToken, async (req,res)=>{
    try{
        const {bookid}=req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    }catch(error){
        return res.status(500).json({ message: "Internal Error" });
    }
});

//get all books

router.get('/get-all-books', async (req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1});
        return res.status(200).json(books);
    }catch(error){
        return res.status(500).json({ message: "Internal Error" });
    }
});

//get recently added books limit 4

router.get('/get-recent-books', async (req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1}).limit(4);
        return res.status(200).json(books);
    }catch(error){
        return res.status(500).json({ message: "Internal Error" });
    }
});

//get book by id

router.get('/get-book/:id', async (req,res)=>{
    try{
        const book=await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    }catch(error){
        return res.status(500).json({ message: "Internal Error" });
    }
});

module.exports = router;