const usersDB={
  users: require('../model/users.json'),
  setUsers: function(Data){this.users=Data}
}

const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleRefreshToken = (req,res)=>{
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(401);
//checks for if cookies are available or not 
//and if cookies are available then are jwt available or not
  const refreshToken=cookies.jwt;

  const foundUser = usersDB.users.find(person=>person.refreshToken===refreshToken);
  if(!foundUser) return res.sendStatus(403);//forbidden
  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded)=>{
      if(err||foundUser.username!==decoded.username) return res.sendStatus(403)
      const accessToken= jwt.sign(
        {"username":decoded.username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'120s'}
      );
      res.json({
        "success":"true",
        "message":`${decoded.username}'s token is verified`,
        accessToken
      })
  })
}
module.exports={handleRefreshToken}

