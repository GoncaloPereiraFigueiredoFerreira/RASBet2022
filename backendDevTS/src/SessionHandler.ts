const sha1 = require('sha1');



let instance:any = undefined;
export class SessionHandler implements ISessionHandler{
    sessions:  {[key: string]: any};
    
    constructor(){
        this.sessions= {};
    }

    /**
     * Adds a communication gate to the session
     * @param token Token of the user
     * @param gate Gate for communication
     */
    addGate(email:string,gate:any){
        
        this.sessions[email] = gate;
       
    }

    /**
     * Closes the connection to the user
     * @param token Token
     */
    closeConnection(email:string){
        
        //removes from token from sessions
        //delete this.sessions[token]
    }

    /**
     * Send a SSE to a user
     * @param token Token of the user
     * @param info Information to be sent
     */
    sendNotification(email:string,info:object){
        
        if (this.sessions[email] != undefined){
          const data = `data: ${JSON.stringify(info)}\n\n`;
          this.sessions[email].write(data);
        }
    }


    /**
     * 
     * @returns Returns the instance of the Session handler
     */
    static getInstance(){
        if (instance == undefined){
            instance = new SessionHandler();
        }
        return instance;

    }


}

