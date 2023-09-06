const express = require('express');
const multer = require('multer')
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors())

mongoose.connect('mongodb+srv://rahulraj6263707:Pradeep123@blog0.iis1vtb.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const registerSchema = new mongoose.Schema({
name: String,
email: String,
password:String
})
const postSchema = new mongoose.Schema({
    name: String,
    title: String,
    category:String,
    image:String,
    description:String,
    email:String
})


const register = mongoose.model('blogs', registerSchema);
const post = mongoose.model('blog_feed',postSchema);


app.post("/postblog",async (req,resp)=>{
    let obj = {
        name:req.body.name,
        title:req.body.title,
        category:req.body.category,
        image:req.body.file,
        description:req.body.description,
        email:req.body.email
    }
    console.log(obj);
    let p = new post(obj);
    let res = await p.save();
    resp.send(res);
})

app.post("/explore",async (req,resp)=>{
    let res;
    let email = req.body.email;
    if(email){
        res = await post.find({email:email});
    }else{
        res = await post.find({});
    }
    resp.send(res);
})

app.post("/blog",async (req,resp)=>{
    var ObjectId = require('mongodb').ObjectId;
    var id = req.body.id; 
    var o_id = new ObjectId(id);
    let res = await post.find({_id:o_id});
    console.log(res,id);
    resp.send(res[0]);
})






app.post("/register",async (req,resp)=>{
    let obj = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    //console.log(obj);
    let reg = new register(obj);
    let res = await reg.save();
    resp.send(res);

})

app.post("/login",async (req,resp)=>{
    let obj = {
        email:req.body.email,
        password:req.body.password
    }
   // console.log(obj);
    let user = await register.findOne(obj).select("-password");
    resp.send(user);

})


const upload = multer({
    storage:multer.diskStorage({
        destination:function(req,resp,cd){
            cd(null,"./frontend/src/Components/uploads");
        },
        filename:function (req,resp,cb) {
            cb(null,`${new Date().getDate()}${resp.originalname}`);
          }
    })
}).single("user_file");


app.post('/upload',upload,(req,resp)=>{
    resp.send(JSON.stringify({send:true}));
})

app.delete("/delete/:_id",async (req,resp)=>{
console.log(req.params);
let data = await post.deleteOne(req.params);
resp.send({status:true})
})

app.put("/update/:id",async (req,resp)=>{
    console.log(req.params);
    let data = await post.updateOne(
        req.params,
        {
            $set:req.body
        }
    )
    console.log(data);
    resp.send(data);
})

app.listen(4000);