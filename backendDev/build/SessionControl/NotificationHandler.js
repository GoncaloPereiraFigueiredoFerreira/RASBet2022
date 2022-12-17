"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationHandler = void 0;
const emailHandler = require("./EmailHandler");
let instance = undefined;
class NotificationHandler {
    constructor() {
        this.sessions = {};
        this.notificationQueue = {};
    }
    /**
     * Adds a communication gate to the session
     * @param token Token of the user
     * @param gate Gate for communication
     */
    addGate(email, gate) {
        this.sessions[email] = gate;
        if (this.notificationQueue[email] != undefined) {
            while (this.notificationQueue[email].length > 0) {
                let notification = this.notificationQueue[email].pop();
                if (notification != undefined)
                    this.sendNotification(email, notification);
            }
        }
    }
    addWalletNotification(email, value) {
        if (this.sessions[email] != undefined) {
            this.sendNotification(email, { Balance: value });
        }
    }
    addBetNotification(email, msg) {
        let obj = { betInfo: msg };
        if (this.sessions[email] != undefined) {
            this.sendNotification(email, obj);
        }
        else {
            if (this.notificationQueue[email] != undefined)
                this.notificationQueue[email] = [];
            this.notificationQueue[email].push(obj);
        }
        //emailHandler.sendMail(email,"Atualização do estado da Aposta",msg,null);
    }
    /**
     * Closes the connection to the user
     * @param token Token
     */
    closeConnection(email) {
        //removes from token from sessions
        //delete this.sessions[token]
    }
    /**
     * Send a SSE to a user
     * @param token Token of the user
     * @param info Information to be sent
     */
    sendNotification(email, info) {
        if (this.sessions[email] != undefined) {
            const data = `data: ${JSON.stringify(info)}\n\n`;
            this.sessions[email].write(data);
        }
    }
    /**
     *
     * @returns Returns the instance of the Session handler
     */
    static getInstance() {
        if (instance == undefined) {
            instance = new NotificationHandler();
        }
        return instance;
    }
}
exports.NotificationHandler = NotificationHandler;
