db 

cities- //

city_id    primary key
name
pincode


theatres- //

theatre_id   primary key
name 
address 
city_id      foreign key

shows-  //

show_id     primary key
movie_name
starttime  
endtime
price
theatre_id    foreign key 


seats-  //

seat_id   primary key
seat_number
is_available
show_id    foreign key

booking-  //
booking id   primary key
customer_id  foreign key
seat_id      foreign key
is_booked


user- //

customer_id   primary key
name
contact 
gender 
dob 
address 
email 
password (hashed)
meta data





APIs : Create User, update user, get all theatres in a city, book a ticket, get all tickets for a user,
Get booking details by booking id.


select * from booking where booking.customer_id= customer_id



const express = require("express");
const cors = require("cors");
require("./db/config");

const app = express();

app.use(express.json());
app.use(cors());

// products



//user
app.post("/signup", async (req,resp) =>{
    let usercheck = await User.findOne({email:req.body.email}).select("-password");
    if(usercheck)
    {
        resp.send("User already exists");
    }
    else
    {
    let user= new User(req.body);
    let result = await user.save();
    result = await User.findOne({email:req.body.email}).select("-password");
    resp.send(result);
    }
});


app.post("/signin", async (req,resp) =>{
    let usercheck = await User.findOne({email:req.body.email});
    if(usercheck)
    {
       if(usercheck.password===req.body.password)
       {
       let result = await User.findOne({email:req.body.email}).select("-password");
        resp.send(result);
       }
       else
       {
        resp.send("Invalid credentials"); 
       }
    }
    else
    {
        resp.send("User does not exist");
    }
});



//cart

app.get("/cart/:userid",async (req,resp)=>{
     let cart = await Cart.find({userid:req.params.userid});
     resp.send(cart);
});

app.post("/add-cart", async(req,resp)=>{
    let cart= new Cart(req.body);
    let result = await cart.save();
    resp.send(result);
})

app.put("/update-cart",async (req,resp)=>{
    let data= await Cart.updateOne(
        {userid:req.body.userid ,id:req.body.id},
        {
          $set : { qty:req.body.qty }
        }
    );
    resp.send(data);
});


app.delete("/delete-cart", async (req,resp)=>{
    let data = await Cart.deleteOne(
        { userid: req.body.userid, id:req.body.id }
   );
    resp.send(data);
});











app.listen(5000);
