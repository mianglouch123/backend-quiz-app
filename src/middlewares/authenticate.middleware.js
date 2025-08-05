import "dotenv/config"
import {request , response} from "express";
import jwt from "jsonwebtoken";


export class AunthenticateMiddleware {

run = async (req = request , res = response , next) => {
    
const token = req.header("Authorization");

try {

if(!token) res.status(403).json({ message : "token not found" , data : null , token })

let decodedToken = jwt.verify(token, process.env.JWT_KEY);

req.user = decodedToken

next();


}
catch(e) {
  
return res.status(400).json({ message : "internal error in middleware auth" , data : null , token })
 
}

}

}