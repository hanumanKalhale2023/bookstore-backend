const mongoose = require('mongoose')

const user=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avtar:{
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ90Rdf6mqhLFYOYZ8rQ3cvyKuy4ivyndKLgfzpj1AYfVCeyHQ7gRrjhx7jXG_E37BtUQE&usqp=CAU'
    },
    favourites:[{
        type: mongoose.Types.ObjectId,
        ref: 'books',
    }],
    cart:[{
        type: mongoose.Types.ObjectId,
        ref: 'books',
    }],
    orders:[{
        type: mongoose.Types.ObjectId,
        ref: 'order',
    }],
},{timestamps: true})

module.exports=mongoose.model('user',user)