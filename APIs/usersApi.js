//create mini-express app
const exp=require("express");
const userApp=exp.Router()
const  expressAsyncHandler=require("express-async-handler");

const bcryptjs=require("bcryptjs");

const jwt=require("jsonwebtoken");
const verifyToken=require("./middlewares/verifyToken")


//bodt paraser middleware
userApp.use(exp.json());

 
let user=[];
//app.set(user,'user') 



// create Apis


//get users

userApp.get('/get-user/:username',expressAsyncHandler(async(request ,response)=>{


  //get usercollectionObj 
  const userCollectionObj=request.app.get("userCollectionObj");
  /// get username from url
  let usernameFromUrl=request.params.username;
  //find the user by username
  const userOfDB=await userCollectionObj.findOne({username:usernameFromUrl})
  // if user not existed
  if(userOfDB===null){
    response.status(200).send({message:"User not found"});
  }
  else{
      delete userOfDB.password;
      response.status(200).send({message:"User",payload:userOfDB});
  }
 
    
}
));
// get user by id

userApp.get('/get-user/:id', expressAsyncHandler(async(request, response) => {

  const userCollectionObj=request.app.get("userCollectionObj");



  //get userid from url
  let userId=(+request.params.id)
  // find user
  userCollectionObj.findOne({id:userId})
   let user= await userCollectionObj.findOne({id:userId})
    response.status(200).send({message:"User",payload:user})
  


    
  }));
  
//PUBLIC ROUTES
  //searching product
  //get selected product od or name
  //get reviews of aproduct
  
  

//PRVATE ROUTE
userApp.get('/test',verifyToken,(request,response)=>{response.send({message:"reply from private route"}) 
 });

 //user login
userApp.post('/user-login',expressAsyncHandler(async(request,response)=>{
  const userCollectionObj=request.app.get("userCollectionObj");

  //get user credentials from req
  const userCredObj=request.body;
  // verify username
  let userOfDB=await userCollectionObj.findOne({username:userCredObj.username})
  //if username is invalid
  if(userOfDB===null){
    response.status(200).send({message:"Invalid username"})
  }
  //if usename is valid
  else{
    //verify password
   let isEqual=await bcryptjs.compare(userCredObj.password,userOfDB.password)
    //if password not matched
    if (isEqual===false){
      response.status(200).send({message:"Invalid password"})
    }
    //if password matched
    else{
      //create jwt token
       let jwtToken= jwt.sign({username:userOfDB.username},'abcdef',{expiresIn:20})
      //send token in response
      response.status(200).send({message:"valid user",token:jwtToken})
      
    }

  }


 }))

  

//create user

userApp.post("/create-user",expressAsyncHandler(async(request,response)=>{

  //get usercollectionObj 
 const userCollectionObj=request.app.get("userCollectionObj")
  //get newuser from request
 const newUser=request.body;
 //check duplicate username

let userOfDB=await userCollectionObj.findOne({username:newUser.username})
 //if user exists,send res to client as"user already existed

 if(userOfDB!=null){
  response.status(200).send({message:"user already existed"})
 }
 //if user not existed

else{

 //hash the password
    let hashedPassword=await bcryptjs.hash(newUser.password,5)
   
 //replace plain pass with hash password
 newUser.password=hashedPassword;
 //insert user
 await userCollectionObj.insertOne(newUser)
 //send res
 response.status(201).send({message:"user created"})
}
 
 
  
})); 


// update user

userApp.put("/update-user/:id",expressAsyncHandler(async(request,response)=>{


  //get usercollectionObj 
  const userCollectionObj=request.app.get("userCollectionObj");
  //get modified  user client
  let modifiedUser=request.body;
  //update
  let dbRes=await userCollectionObj.updateOne({id:modifiedUser.id},{$set:{...modifiedUser}})
  
    response.status(200).send({message:"User updated"})





  




   
}));
//delete user

userApp.delete("/delete-user/:id",expressAsyncHandler(async(request,response)=>{

  //get usercollectionObj 
  const userCollectionObj=request.app.get("userCollectionObj");
  //get urlid
  let userId=(+ request.params.id)
  //delete user from db
  let dbRes=await userCollectionObj.deleteOne({id:"userId"})
  response.status(200).send({message:"User deleted"})

 
   
    
}));   







//export userApp
module.exports=userApp;
