var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var morganBody = require('morgan-body');
const mongoose = require('mongoose');
const conn = mongoose.createConnection("mongodb://127.0.0.1:27017/TestDb");
// const conn = mongoose.createConnection("mongodb://drproperty1:drproperty15@127.0.0.1:27017/DrProperty");
let  UserSchema  = mongoose.Schema(
    {

        
        email : {
            type: String,
            ref: 'User',
            default : null
        },
        password : {
            type: String,
            
            default : null
        },
        image : {
            type : String, 
            default : null
        }, //1 = accepted, 2 = rejected , 0  = pending
        created_on : { type: String }
    },
    {
        strict: true,
        collection: 'User',
        versionKey: false
    }
    

);
UserModel = conn.model('User', UserSchema);
console.log('connected')
exports.mongoose = mongoose;
exports.conn = conn;
var server=app.listen(3000,function() {});

app.use(bodyParser.json());
morganBody(app);
app.get('/',function(req,res)
{
res.send('Hello World!');
});

app.post('/create', async function(req, res){
	try {
		var {email, password} = req.body;
		var created_on = new Date().getTime();
		var insertData = {email, password, created_on};
		var userData = new UserModel(insertData)
		var insertedData = await userData.save();
		res.status(200).json(insertedData);
	} catch(err) {
		res.sendError(err);
	}
})

app.post('/login', async function(req, res){
	console.log(req.body);
	var {email, password} = req.body;
	console.log(UserModel)
	var userData = await UserModel.findOne({email})
	if(userData.password == password) {
		res.status(200).json({"message" : "login successful.","response" : userData});
	} else { 
		res.status(403).json({"message" : "invalid Data."});
	}
})

app.post('/update', async function(req, res) {
	try {
		var {email, password} = req.body;
		var updatedData = await UserModel.findOneAndUpdate({email}, {$set : {password}}, {new : true})
		res.status(200).json({"message" : "Data updated successful.","response" : updatedData});
	} catch(err) {
		res.sendError(err);
	}
}) 

app.post('/delete', async function (req, res) {
	try {
		var {email} = req.body;
		var deleteData = await UserModel.remove({email})
		res.status(200).json({"message" : "Data deleted successful.","response" : deleteData});
	} catch(err) {
		res.sendError(err);
	}
})
