const usersDB={
  users: require('../model/users.json'),
  setUsers: function(Data){this.users=Data}
}

const fspromises= require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req,res)=>{
  const { user , pwd} = req.body
  if(!user||!pwd){
    return res.status(400).json({"success":"false","message":"incorrect login credential"})
  }
   const duplicate = usersDB.users.find(
     (person) =>{ 
       if(person.username === user){
         return person;
       }
     });
   if(duplicate){ 
   return res.sendStatus(409)//conflict
   }
  try{
  const hashpwd=await bcrypt.hash(pwd,10);
  const newUser={"username":user,"pwd":hashpwd}
  usersDB.setUsers([...usersDB.users,newUser])
  await fspromises.writeFile(
    path.join(__dirname,'..','model','users.json'),
    JSON.stringify(usersDB.users)
  );
  console.log(usersDB.users)
  res.status(201).json({"success":"true","message":`new user ${user}ncreated`,"users":usersDB.users})
  }catch (err) {
    return res.status(500).json({"success":"false", "message":err.message})
  }
}

module.exports = {handleNewUser}
