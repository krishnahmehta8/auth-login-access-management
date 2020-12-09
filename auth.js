const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./model/user');
const app = express();
const jwt = require('jwt-simple');
const util_1 = require('util');
const JWT_SECRET = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiS3Jpc2huYSBNZWh0YS83OTg0NzA3MTc3LzIzMDQxOTk2IiwianRpIjoiZTI3NjJjNzYtZmUzOC00M2YzLTlmNzUtNTdjZTgxOGM2MzZkIiwiaWF0IjoxNjA3NDM1NTkwLCJleHAiOjE2MDc0MzkyMTV9.Ic9g1Va0LXP4Mv-2lnbpCvj5fYHqLE9XGDP47BUi8ms"

//JWT TOKEN PARSEING AND dECODEING IN THIS AUTH.JS FILE 
exports.authJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!util_1.isNullOrUndefined(authHeader)) {
        const token = authHeader.split(' ')[1];
        if(authHeader.split(' ')[0] == 'Bearer'){
            // console.log("hello" , authHeader);
            const decodeCod = await decodeToken(token);
            req.headerParams = {};
            // console.log(decodeCod);
            req.headerParams.role = decodeCod.role;
            req.headerParams.userName = decodeCod.userName;
            let count = await user.find({userName : req.headerParams.userName}).count();
            if(count > 0){
                // console.log(req.headerParams);
                next();
            }else{
                res.sendStatus(403).json({message : "TOken Doesnot Match With the Exsisting Data please register Your self with Application"});
            }    
        // });
    } else {
            res.sendStatus(401);
        }
    }else{
        // console.log("Error")
        res.sendStatus(401);
    }
};

function decodeToken(token){
return new Promise((resolve, reject) => {
    const tokeninfo = jwt.decode(token, JWT_SECRET);
    return resolve(tokeninfo);
});
}

