const ObjectId = require('mongodb').ObjectID;   

const User = require("../model/user");


const  authorize = async (idd, allowedroles) => {

  try{
  let a=false;
  var id = new ObjectId(idd);

  let user = await User.findById(id)


  allowedroles.forEach(role => {


    user.role.forEach(r =>{

      if(r==role){


        a= true;
      }

      });
  });
  
        
    
  return a;
}
catch(e)
{
  console.log(e);
  return false;
}


  };

  module.exports = authorize;