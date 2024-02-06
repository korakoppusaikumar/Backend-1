const exp=require('express');
const productApp=exp.Router()

//product APIs
productApp.get("/get-products",(request,response)=>{
    response.send({message:"All products"})
})
productApp.post('/create-product',(request,response)=>{
    response.send({message:"New products created"})
})

productApp.delete('/delete-product',(request,response)=>{
    response.send({message:"Products deleted"})
});


// export productApp
module.exports=productApp;