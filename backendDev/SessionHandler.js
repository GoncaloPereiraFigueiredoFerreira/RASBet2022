const sha1 = require('sha1');

let instance = undefined;
class SessionHandler{
    constructor(){
        this.sessions = {}
    }

    verifyUser(hash){
        if (this.sessions[hash] != undefined)
            return this.sessions[hash];
        else {
            throw console.error("Hash not found");
        }
    }

    addUser(email){
        let hash = sha1(email+12+email+13)
        this.sessions[hash] = email;
        return hash;
    }

    static getInstance(){
        if (instance == undefined){
            instance = new SessionHandler();
        }
        return instance;

    }


}

module.exports = SessionHandler;