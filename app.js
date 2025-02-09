const express= require('express')

const app = express()
const cors=require('cors')
require("dotenv").config();
require('./conn/conn')
const user = require('./routes/user')
const {userAuth}=require("./routes/userAuth")
const Books=require('./routes/book');
const Favourites = require('./routes/favourite');
const Cart=require('./routes/cart');
app.use(express.json())
app.use(cors());
// routes
app.use('/api/v1',user)
app.use('/api/v1',Books)
app.use('/api/v1',Favourites)
app.use('/api/v1',Cart)
// error handling middleware    



app.get('/', (req, res) => {
    res.send('Welcome to backend!');
});
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})