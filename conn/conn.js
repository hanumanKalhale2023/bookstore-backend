const mongoose = require('mongoose')

const con= async ()=>{
    try{
        await mongoose.connect(`${process.env.URI}`)
        console.log("Database connected successfully")
    }catch(err){
        console.log(err)
    
    }
}

con()