const exp=require("express");
const app=exp();

 

app.listen(3500,()=>console.log(" web server listening in port 3500"));

//get mongo.client
const mclient=require('mongodb').MongoClient;


//connect to db server using mongo client

mclient.connect('mongodb://127.0.0.1:27017')
.then((dbref)=>{
    const dbObj= dbref.db('db1')
    //connect to collections of database
    const userCollectionObj=dbObj.collection("userscollection");
    const productCollectionObj=dbObj.collection("productscollection");
    app.set("userCollectionObj",userCollectionObj)
    app.set("productCollectionObj",productCollectionObj)
    console.log("DB connection sucess")
})  
.catch(err=>console.log(" database  connect error:",err))





// import userapp
const userApp=require("./APIs/usersApi");
const productApp=require("./APIs/productsApi");
 
// execute userApi when api start

app.use('/user-api',userApp)

// execute productApi when api start
app.use('/products-api',productApp)






//invalid path
const invalidPathMiddleware=(request,response,next)=>{
    response.send({message:'Invalid path'})
}
app.use("*",invalidPathMiddleware)
//error handling middlewarwe
const errhandlingMiddleware=(error,request,response,next)=>{
    response.send({message:error.message})

};
app.use(errhandlingMiddleware);