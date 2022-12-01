
interface ISessionHandler{
    /**
     * 
     * @param {String} hash Hash to be verified if it corresponds to an user 
     * @returns Returns a tuple that contains the email and role of a user with the given hash, and throws an error in case
     * the hash is not yet resgistered
     */
    verifyUser(hash:string):string[] | string;


    /**
     * Adds a new user session
     * @param {string} email Email of the user 
     * @param {string} role Role of the user
     * @returns Returns a token
     */
    addUser(email:string,role:string):string;

    /**
     * 
     * @param email String representation of a registered email
     * @returns Returns the token for the given email
     */
    getToken(email:string):string;

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