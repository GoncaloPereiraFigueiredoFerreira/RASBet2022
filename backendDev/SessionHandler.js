const sha1 = require('sha1');

let instance = undefined;
class SessionHandler{
    constructor(){
        this.sessions = {}
    }

    /**
     * 
     * @param {String} hash Hash to be verified if it corresponds to an user 
     * @returns Returns a tuple that contains the email and role of a user with the given hash, and throws an error in case
     * the hash is not yet resgistered
     */
    verifyUser(hash){
        if (this.sessions[hash] != undefined){
            return ([this.sessions[hash]["Email"],this.sessions[hash]["Role"]]);}
        else {
            return ("Hash no found")
            //throw console.error("Hash not found");
        }
    }

    addUser(email,role){
        let hash = sha1(email+12+email+13)
        this.sessions[hash] = {"Email": email, "Role":role };
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