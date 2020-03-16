var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var faker       = require('faker');
var userModel   = require('./models/user');

//connect to db
mongoose.connect('mongodb://localhost:27017/autodemos',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//jquery path
app.use('/jquery',express.static(path.join(__dirname+'/node_modules/jquery/dist/')));

//default pageload
app.get('/',(req,res)=>{
        var users=[];
        for(var i=0;i<10;i++){
            //we generate fake data to insert into db collection
            users.push({'name':faker.name.firstName()});
        }
        userModel.insertMany(users,(err,autoData)=>{
             if(err){
                 console.log(err);
             }else{
                 res.render('demo');
             }
        });
});

app.post('/auto',(req,res)=>{
  userModel.find({name:{'$regex':req.body.auto}},(err,autoData)=>{
             if(err){
                 console.log(err);
             }else{
                 res.json({data:autoData});
             }
  });
});

//assign port
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));