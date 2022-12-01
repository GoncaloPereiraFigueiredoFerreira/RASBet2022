"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionHandler = void 0;
const sha1 = require('sha1');
let instance = undefined;
class SessionHandler {
    constructor() {
        this.sessions = {};
    }
    /**
     *
     * @param {String} hash Hash to be verified if it corresponds to an user
     * @returns Returns a tuple that contains the email and role of a user with the given hash, and throws an error in case
     * the hash is not yet resgistered
     */
    verifyUser(hash) {
        if (this.sessions[hash] != undefined) {
            return ([this.sessions[hash]["Email"], this.sessions[hash]["Role"]]);
        }
        else {
            return "Hash not found";
        }
    }
    /**
     * Adds a new user session
     * @param {string} email Email of the user
     * @param {string} role Role of the user
     * @returns Returns a token
     */
    addUser(email, role) {
        let hash = sha1(email + 12 + email + 13);
        this.sessions[hash] = { Email: email, "Role": role, "Gate": undefined };
        return hash;
    }
    /**
     *
     * @param email String representation of a registered email
     * @returns Returns the token for the given email
     */
    getToken(email) {
        for (let [key, value] of Object.entries(this.sessions)) {
            if (value.Email == email) {
                return key;
            }
        }
        return "";
    }
    /**
     * Adds a communication gate to the session
     * @param token Token of the user
     * @param gate Gate for communication
     */
    addGate(token, gate) {
        this.sessions[token]["Gate"] = gate;
    }
    /**
     * Closes the connection to the user
     * @param token Token
     */
    closeConnection(token) {
        //removes from token from sessions
        //delete this.sessions[token]
    }
    /**
     * Send a SSE to a user
     * @param token Token of the user
     * @param info Information to be sent
     */
    sendNotification(token, info) {
        if (this.sessions[token] != undefined) {
            const data = `data: ${JSON.stringify(info)}\n\n`;
            this.sessions[token]["Gate"].write(data);
        }
    }
    /**
     *
     * @returns Returns the instance of the Session handler
     */
    static getInstance() {
        if (instance == undefined) {
            instance = new SessionHandler();
        }
        return instance;
    }
}
exports.SessionHandler = SessionHandler;
