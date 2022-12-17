require("dotenv").config();
const jwt = require('jsonwebtoken')

export class AuthenticationHandler{
    refreshTokens:string[];

    constructor(){
        this.refreshTokens=[]
    }

    authenticateToken(req:any,res:any,next:any){
        
        const token = req.headers.accesstoken?req.headers.accesstoken:(req.query.token?req.query.token:null)
        

        /*const token = req.query.ApostadorID? req.query.ApostadorID:
                     (req.query.token? req.query.token: 
                     (req.query.Token? req.query.Token: 
                     (req.body.Token? req.body.Token:
                     (req.body.token? req.body.token: 
                     (req.body.ApostadorID? req.body.ApostadorID:
                     (req.body.Aposta.ApostadorID? req.body.Aposta.ApostadorID: null))))))*/
                     
        //console.log(`Authentication: ${token}`)
        if(token == null) return res.sendStatus(401)
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err:any,Info:any)=>{
           
            if (err) return res.sendStatus(403)
            //console.log(`Authentication: ${Info}`)
            req.email = Info.userInfo.email
            req.role = Info.userInfo.role
            next()
        })
    }

    verifyRoles(...allowedRoles:any){
        return(req:any,res:any,next:any)=>{
            if(!req?.role) return res.sendStatus(401)
            const rolesArray = [...allowedRoles]
            const result = rolesArray.includes(req.role)
            //console.log(`VerifyRoles: ${rolesArray}`)
            //console.log(`VerifyRoles: ${result}`)
            if(!result) return res.sendStatus(401)
            next()
        }
    }


    generateRefreshToken(userInfo:any){
        const refreshToken = jwt.sign(userInfo,process.env.REFRESH_TOKEN_SECRET)
        this.refreshTokens.push(refreshToken)
        return refreshToken
    }

    refreshAccessToken(refreshToken:any){
        
        if(!this.refreshTokens.includes(refreshToken)){
            return null
        }
        return (jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err:any,Info:any)=>{
            if(err) return null
            return this.generateAccessToken({userInfo:{email:Info.userInfo.email,role:Info.userInfo.role}})
        }))
       
    }

    delete(token:any){
        this.refreshTokens= this.refreshTokens.filter(t => t !== token)
    }
    
    generateAccessToken(userInfo:any){
        return jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'600s'})
    }

}

