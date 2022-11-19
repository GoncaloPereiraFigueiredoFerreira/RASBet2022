/**
 * @file EventList,js
 * 
 */

const RaceEvent = require("./RaceEvent");
const NoTieEvent = require("./NoTieEvent");
const TieEvent = require("./TieEvent");
const SportEvent = require("./SportEvent");

const BETODDREL = 0.001;


let instance = undefined

class EventList{

    constructor(){
        this.eventList = {};
        this.leagues ={};
    }

    /**
     * Creates an instance of the EventList class if it does not exist, 
     * else returns the existing one
     * @returns Returns the singleton instance of this class
     */
    static getInstance(){
        if (instance == undefined){
            instance = new EventList();
        }
        return instance;
    }

    /**
     * Adds an event provinient from the API
     * @param {SportEvent} event Event to be added
     */
    addEventFromAPI(event){
        if (this.eventList[event.getSport()] == undefined) {
            this.eventList[event.getSport()] = {};
            this.leagues[event.getSport()] = [];
        }
        this.eventList[event.getSport()][event.getID()] = event;
        if (!this.leagues[event.getSport()].includes(event.getLeague()))  this.leagues[event.getSport()].push(event.getLeague());
    }

    /**
     * Adds an event from the DB
     * 
     * @param {string} sport Kind of sport
     * @param {string} league Name of the League
     * @param {string} id Identifier of event
     * @param {string} description Description for event
     * @param {number} result Result of the event
     * @param {string} state State of the game
     * @param {string} datetime Date of the event
     */
    addEventFromDB(sport,league,id,description,result,state,datetime){
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
            this.leagues[sport] = [];
        }
        this.eventList[sport][id] = new SportEvent(sport,league,id,description,result,state,datetime);
        if (!this.leagues[sport].includes(league))  this.leagues[sport].push(league);
        
    }

    /**
     * Returns an event given a sport and an ID
     * @param {string} sport 
     * @param {string} id 
     * @returns An Event (not a copy)
     */
    getEvent(sport,id){
        if (this.eventList[sport] != undefined && this.eventList[sport][id]){
            return this.eventList[sport][id];
        }
        else return undefined;
    }

    /**
     * Method that alters the odd for a specific event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of event
     * @param {List} odds List of odds to be assigned
     * @returns Returns true if the odds were added correctly
     */
    changeEventOdd(sport,id,odds){

        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "NODD"){
                if (this.eventList[sport][id] instanceof RaceEvent || this.eventList[sport][id] instanceof NoTieEvent || this.eventList[sport][id] instanceof TieEvent){
                    this.eventList[sport][id].changeOdds(odds);
                    this.eventList[sport][id].readyEvent();
                    return true;
                }
        }
        return false;
    }


    /**
     * Method that updates the odds of an event based on a bet
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of event
     * @param {number} money Money used in the bet
     * @param {number} choice Team with bet
     * @returns Returns true if the odds were added correctly
     */
     updateOddBet(sport,id,money,choice){
        let odds = [];
        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "BET"){
                if (this.eventList[sport][id] instanceof RaceEvent || this.eventList[sport][id] instanceof NoTieEvent || this.eventList[sport][id] instanceof TieEvent){
                    odds = this.eventList[sport][id].getOdds();
                    for (let i=0; i<odds.length;i++){
                        if (i != choice) odds[i]+=money*BETODDREL;
                        else if (odds[i]>1) odds[i]-=money*BETODDREL;
                    }
                    this.eventList[sport][id].changeOdds(odds);
                    return true;
                }
        }
        return false;
    }






    /**
     * Function responsible for returning the stored events withou odds from a sport
     * @param {string} sport Name of the sport  
     * @returns Returns a list of event without odds
     */
    getNODDEvents(sport){
        let lst = [];
        for(let match in this.eventList[sport]){
            if (this.eventList[sport][match].getState() == "NODD") {
                lst.push(this.eventList[sport][match].toJson()); 
            
            }
        }
        return lst.sort((a,b)=>{
            return new Date(a["Data"]) -new Date(b["Data"]) 

        });
    }

    /**
     * Returns a list of events ready for receiving bets
     * @param {string} sport Name of the sport
     * @returns A list of events ready for receiving bets
     */
    getBETEvents(sport){
        let lst = [];
        for(let match in this.eventList[sport]){
            if (this.eventList[sport][match].getState() == "BET") lst.push(this.eventList[sport][match].toJson());
        }
        return lst.sort((a,b)=>{
            return new Date(a["Data"]) -new Date(b["Data"]) 

        });
    }

    /**
     * Returns an event to the front end
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of a sport
     * @returns Returns a JSON that the front end is ready to parse
     */
    getEventFE(sport,id){
        if (this.eventList[sport][id] != undefined)
            return this.eventList[sport][id].toJson();

        else return null;
    }

    /**
     * Returns a event object that the DB is ready to parse
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of a sport
     * @returns Returns a JSON that the DB is ready to parse
     */
    getEventDB(sport,id){
        if (this.eventList[sport][id] != undefined)
            return this.eventList[sport][id].toDB();

        else return null;
    }


    /**
     * Updates the winner of a given event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @param {number} result The result of the event
     * @param {string} description Updated description
     */
    updateWinner(sport,id,result,description){
        this.eventList[sport][id].updateWinner(result,description);
    }

    /**
     * Activate super odds in a given event
     * @param {string} sport Name of the support
     * @param {string} id Identifier of the event
     * @param {number} multiplier Multiplier of the odd
     * @returns Returns true if the supper odd was activated in the specific event
     */ 
    superOdds(sport, id,multiplier){
        if (this.eventList[sport][id] != undefined && !this.eventList[sport][id].isSuperOddsOn()){
            this.eventList[sport][id].superOdds(multiplier);
            return true;
        }
        else return false;
    }

    /**
     * Closes an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns true if the event was closed, and false otherwise
     */
    closeEvent(sport,id){
        if (this.eventList[sport][id] != undefined){
            this.eventList[sport][id].closeEvent();
            return true;
        }
        else return false;
    }
    /**
     * Returns the participants of an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event 
     * @returns Returns a list of participants in the event
     */
    getParticipants(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getParticipants();

        }
        else return null;
    }
    /**
     * Returns the odds for the results of a given event
     * @param {string} sport 
     * @param {string} id 
     * @returns REturns a list of odds
     */
    getOdds(sport,id){
        if (this.eventList[sport][id] != undefined){  
            return this.eventList[sport][id].getOdds();
        }
        else return null;
    }

    /**
     * Returns the state of a given sport event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event 
     * @returns Returns the state of the event
     */
    getState(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getState();
        }
        else return null;
    }

    /**
     * Returns a event object that the DB is ready to parse
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of a sport
     * @returns Returns a JSON that the DB is ready to parse
     */
    toDb(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].toDB();
        }
        else return null;
    }
    /**
     * Returns the description for an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns a string containing the description of an event
     */
    getDescription(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getDescription();
        }
        else return null;
    }
    
    getLeagues(sport){
        if (this.leagues[sport] != undefined){
            return this.leagues[sport];
        }
        else return [];
    }
    

}

module.exports = EventList;