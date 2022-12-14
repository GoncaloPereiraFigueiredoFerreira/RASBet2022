"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = void 0;
require("dotenv").config();
const jwt = require('jsonwebtoken');
class AuthenticationHandler {
    authenticateToken(req, res, next) {
        const token = req.headers.accesstoken ? req.headers.accesstoken : (req.query.token ? req.query.token : null);
        /*const token = req.query.ApostadorID? req.query.ApostadorID:
                     (req.query.token? req.query.token:
                     (req.query.Token? req.query.Token:
                     (req.body.Token? req.body.Token:
                     (req.body.token? req.body.token:
                     (req.body.ApostadorID? req.body.ApostadorID:
                     (req.body.Aposta.ApostadorID? req.body.Aposta.ApostadorID: null))))))*/
        //console.log(`Authentication: ${token}`)
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
    generateRefreshToken(userInfo, dbComms) {
        const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
        console.log(refreshToken);
        return dbComms.pushTokenOnDb(refreshToken, userInfo.userInfo.email).then(() => {
            return Promise.resolve(refreshToken);
        }).catch((e) => {
            return Promise.reject(e);
        });
    }
    refreshAccessToken(refreshToken, dbComms) {
        return dbComms.getTokenOnDb(refreshToken).then((result) => {
            if (!result) {
                return Promise.resolve(null);
            }
            return (jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, Info) => {
                if (err)
                    return Promise.resolve(null);
                return Promise.resolve(this.generateAccessToken({ userInfo: { email: Info.userInfo.email, role: Info.userInfo.role } }));
            }));
        }).catch((e) => {
            return Promise.reject(e);
        });
    }
    delete(email, dbComms) {
        dbComms.deleteTokensOnDb(email).catch((e) => { console.log(e); });
    }
    generateAccessToken(userInfo) {
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
