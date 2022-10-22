const sha1 = require('sha1');

let instance = undefined;
class SessionHandler{
    constructor(){
        this.sessions = {}
    }

    /**
     * 
     * @param {The hash to be verified if it corresponds to an user} hash 
     * @returns Returns a tuple that contains the email and role of a user with the given hash, and throws an error in case
     * the hash is not yet resgistered
     */
    verifyUser(hash){
        if (this.sessions[hash] != undefined){
            console.log("aqui vai")
            console.log(this.sessions[hash]["Email"],this.sessions[hash]["Role"])
            return ([this.sessions[hash]["Email"],this.sessions[hash]["Role"]]);}
        else {
            throw console.error("Hash not found");
        }
    }

    addUser(email,role){
        let hash = sha1(email+12+email+13)
        this.sessions[hash] = {"Email": email, "Role":role };
        return hash;
    }

    vu(email){
        return sha1(email+12+email+13)
    }

    static getInstance(){
        if (instance == undefined){
            instance = new SessionHandler();
        }
        return instance;

    }


}

module.exports = SessionHandler;