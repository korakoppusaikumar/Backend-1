const jwt=require("jsonwebtoken")

// write a middleware function to verify token
const verifyToken=(request,response,next)=>{
    // get bearer token from req.headers
    const bearerToken=request.headers.authorization;
    //if bearer token not found
    if(bearerToken===undefined){
        response.send({message:"Unauthorized acess..plz login first"})
    }
    //if bearer token is existed
    else{
        //get token from bearer token
        const token=bearerToken.split(" ")[1]//["bearer",token]
        //verify token
        try{
            jwt.verify(token,"abcdef")
            //calling next middleware
            next()
        }
        catch(err){
            //forward err to err handling middleware
            next(new Error("session expired.please relogin to continue"))
        }
    }

}
module.exports=verifyToken;