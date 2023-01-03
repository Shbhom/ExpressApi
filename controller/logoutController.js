const usersDB={
  users: require('../model/users.json'),
  setUsers: function(Data){this.users=Data}
}

const path = require('path');
const fsPromises = require('fs').promises

const handleLogout = async (req,res)=>{
  const cookies = req.cookies;

  if(!cookies?.jwt) return res.sendStatus(204);//no content
  //checks for if cookies are available or not 
  //and if cookies are available then are jwt available or not
  const refreshToken=cookies.jwt;
  
  //refresh token in db?
  const foundUser = usersDB.users.find(person=>person.refreshToken===refreshToken);
  if(!foundUser){ 
    res.clearCookie('jwt',{httpOnly:true});
    return res.sendStatus(204);//forbidden
  }

  //delete the refresh token
  const otherUsers=usersDB.users.filter(person=>person.refreshToken!==foundUser.refreshToken)
  const currentUser={...foundUser,otherUsers};
  usersDB.setUsers([...otherUsers,currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname,'..','model','users.json'),
    JSON.stringify(usersDB.users,null,2)
  );

  res.clearCookie('jwt',{httpOnly:true,secure:true});
  res.sendStatus(204);
}
module.exports={handleLogout}

