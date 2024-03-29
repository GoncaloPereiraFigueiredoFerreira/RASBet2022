const emailHandler = require("./EmailHandler");
let instance:any = undefined;

export class NotificationHandler implements INotificationHandler{
    sessions:  {[key: string]: any};
    notificationQueue:{[key:string]:object[]};
    
    constructor(){
        this.sessions= {};
        this.notificationQueue={};
    }

    /**
     * Adds a communication gate to the session
     * @param token Token of the user
     * @param gate Gate for communication
     */
    addGate(email:string,gate:any){
        this.sessions[email] = gate;
      
        if (this.notificationQueue[email]!=undefined)
        {   
           
            while (this.notificationQueue[email].length >0){
                let notification= this.notificationQueue[email].pop();
                if (notification!= undefined) this.sendNotification(email,notification);
            }
        }
    }

    addWalletNotification(email:string,value:number){
        if (this.sessions[email]!=undefined){
            this.sendNotification(email,{Balance:value});
        }
    }

    addBetNotification(emails:string[],msg:string){
        
        for( let j = 0; j< emails.length;j++){

            let obj = {betInfo:msg};
            
            if (this.sessions[emails[j]]!=undefined){
                this.sendNotification(emails[j],obj);
            }else{
              
                if (this.notificationQueue[emails[j]]==undefined) this.notificationQueue[emails[j]]=[];

                this.notificationQueue[emails[j]].push(obj);
              
            }
            //emailHandler.sendMail(emails[j],"Atualização do estado da Aposta",msg,null);
        }
    }


    /**
     * Closes the connection to the user
     * @param token Token
     */
    closeConnection(email:string){
        
        //removes from token from sessions
        delete this.sessions[email]
    }

    /**
     * Send a SSE to a user
     * @param token Token of the user
     * @param info Information to be sent
     */
    private sendNotification(email:string,info:object){
        
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
            instance = new NotificationHandler();
        }
        return instance;

    }


}

