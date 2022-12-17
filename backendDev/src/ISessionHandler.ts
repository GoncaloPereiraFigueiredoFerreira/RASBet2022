
interface ISessionHandler{
    
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

    /**
     * Send a SSE to a user
     * @param token Token of the user
     * @param info Information to be sent
     */
    sendNotification(token:string,info:object):void;



}