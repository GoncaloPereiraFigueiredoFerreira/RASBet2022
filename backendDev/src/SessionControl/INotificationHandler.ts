
interface INotificationHandler{
    
    /**
     * Adds a communication gate to the session
     * @param token Token of the user
     * @param gate Gate for communication
     */
    addGate(token:string,gate:any):void;

    /**
     * Closes the connection to the user
     * @param token Token
     */
    closeConnection(token:string):void;

    addWalletNotification(email:string,value:number):void;

    addBetNotification(email:string,msg:string):void;

}