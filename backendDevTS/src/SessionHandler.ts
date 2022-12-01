const sha1 = require('sha1');

let instance:any = undefined;
export class SessionHandler{
    sessions:  {[key: string]: {Email:string,Role:string, Gate:any}};
    
    constructor(){
        this.sessions= {};
    }

    /**
     * 
     * @param {String} hash Hash to be verified if it corresponds to an user 
     * @returns Returns a tuple that contains the email and role of a user with the given hash, and throws an error in case
     * the hash is not yet resgistered
     */
    verifyUser(hash:string){
        if (this.sessions[hash] != undefined){
            return ([this.sessions[hash]["Email"],this.sessions[hash]["Role"]]);}
        else {
            return ("Hash no found")
        }
    }

    /**
     * Adds a new user session
     * @param {string} email Email of the user 
     * @param {string} role Role of the user
     * @returns Returns a token
     */
    addUser(email:string,role:string){
        let hash = sha1(email+12+email+13)
        this.sessions[hash as keyof typeof this.sessions] = {Email: email, "Role":role, "Gate":undefined};
        return hash;
    }

    getToken(email:string){
        for (let [key, value] of Object.entries(this.sessions)){
            if (value.Email == email){
                return key;
            }
        }
        return "";
    }

    addGate(token:string,gate:any){
        
        this.sessions[token]["Gate"] = gate;
    }

    closeConnection(token:string){
        
        //removes from token from sessions
        //delete this.sessions[token]
    }

    sendNotification(token:string,info:object){
        
        if (this.sessions[token] != undefined){
          const data = `data: ${JSON.stringify(info)}\n\n`;
          this.sessions[token]["Gate"].write(data);
        }
    }

    static getInstance(){
        if (instance == undefined){
            instance = new SessionHandler();
        }
        return instance;

    }


}

