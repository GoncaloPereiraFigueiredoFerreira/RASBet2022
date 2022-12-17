"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationHandler = void 0;
require("dotenv").config();
const jwt = require('jsonwebtoken');
class AuthenticationHandler {
    authenticateToken(req, res, next) {
        const token = req.query.ApostadorID ? req.query.ApostadorID :
            (req.query.token ? req.query.token :
                (req.query.Token ? req.query.Token :
                    (req.body.Token ? req.body.Token :
                        (req.body.token ? req.body.token :
                            (req.body.ApostadorID ? req.body.ApostadorID :
                                (req.body.Aposta.ApostadorID ? req.body.Aposta.ApostadorID : null))))));
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
            console.log(`VerifyRoles: ${rolesArray}`);
            console.log(`VerifyRoles: ${result}`);
            if (!result)
                return res.sendStatus(401);
            next();
        };
    }
    generateRefreshToken(userInfo) {
        return jwt.sign(userInfo, process.env.REFRESH_TOKEN_SECRET);
    }
    generateAccessToken(userInfo) {
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' });
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
