"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = void 0;
require("dotenv").config();
const jwt = require('jsonwebtoken');
class AuthenticationHandler {
    /**
     * MiddleWare Method that verifies the given ACCESS_TOKEN
     */
    authenticateToken(req, res, next) {
        const token = req.headers.accesstoken ? req.headers.accesstoken : (req.query.token ? req.query.token : null);
        if (token == null)
            return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, Info) => {
            if (err)
                return res.sendStatus(403);
            //console.log(`Authentication: ${Info}`)
            req.email = Info.userInfo.email;
            req.role = Info.userInfo.role;
            next();
        });
    }
    /**
     * MiddleWare Method that verifies if who made the request is allowed to do so
     */
    verifyRoles(...allowedRoles) {
        return (req, res, next) => {
            if (!(req === null || req === void 0 ? void 0 : req.role))
                return res.sendStatus(401);
            const rolesArray = [...allowedRoles];
            const result = rolesArray.includes(req.role);
            //console.log(`VerifyRoles: ${rolesArray}`)
            //console.log(`VerifyRoles: ${result}`)
            if (!result)
                return res.sendStatus(401);
            next();
        };
    }
    /**
     * Method to generate a REFRESH_TOKEN and push it to the DB
     */
    generateRefreshToken(userInfo, dbComms) {
        const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
        return dbComms.pushTokenOnDb(refreshToken, userInfo.userInfo.email, userInfo.userInfo.role).then(() => {
            return Promise.resolve(refreshToken);
        }).catch((e) => {
            return Promise.reject(e);
        });
    }
    /**
     * Method that gives a new ACCESS_TOKEN if given REFRESH_TOKEN is in DB
     */
    refreshAccessToken(refreshToken, dbComms) {
        return dbComms.getTokenOnDb(refreshToken).then((result) => {
            if (result.length == 0) {
                return Promise.resolve(null);
            }
            return (Promise.resolve(this.generateAccessToken({ userInfo: { email: result.Email, role: result.URole } })));
        }).catch((e) => {
            return Promise.reject(e);
        });
    }
    // delete(email:string,dbComms:DBCommunication){
    //     dbComms.deleteTokensOnDb(email).catch((e:any)=>{console.log(e)})
    // }
    /**
     * Method that generates an ACCESS_TOKEN
     */
    generateAccessToken(userInfo) {
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
