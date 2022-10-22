/**
 * @file EventList,js
 * @author Gonçalo Ferreira
 * 
 */

const RaceEvent = require("./RaceEvent");
const NoTieEvent = require("./NoTieEvent");
const TieEvent = require("./TieEvent");

let instance = undefined

class EventList{

    constructor(){
        this.eventList = {};
    }

    /**
     * @description Creates an instance of the EventList class if it does not exist, 
     * else returns the existing one
     * @returns Returns the singleton instance of this class
     */
    static getInstance(){
        if (instance == undefined){
            instance = new EventList();
        }
        return instance;
    }

    addEvent(event){
        if (this.eventList[event.getSport()] == undefined) {
            this.eventList[event.getSport()] = {};
        }
        this.eventList[event.getSport()][event.getID()] = event;
    }

    /// Method that alters the inital odd for an event
    changeEventOdd(sport,id,odds){
        if (this.eventList[sport][id] != undefined){
            if (this.eventList[sport][id] instanceof RaceEvent){
                this.eventList[sport][id].changeOdds(odds);
                this.eventList[sport][id].readyEvent();
            }
            else if (this.eventList[sport][id] instanceof NoTieEvent){
                 this.eventList[sport][id].changeOdds(odds[0],odds[1]);
                 this.eventList[sport][id].readyEvent();
            }
            else if (this.eventList[sport][id] instanceof TieEvent){
                this.eventList[sport][id].changeOdds(odds[0],odds[1],odds[2]);
                this.eventList[sport][id].readyEvent();
            }
        }
    }

    /// Returns a list of events without Odds
    getSOEvents(sport){
        let lst = [];
        for(let match of this.eventList[sport]){
            if (match.getState() == "SO") {
                if (match instanceof TieEvent){
                    lst.push(match.toJsonV2());
                }
                else{
                    lst.push(match.toJson()); 
                }
            }
        }
        return lst;
    }

    /// Returns the list of events ready for bets
    getBETEvents(sport){
        let lst = [];
        for(let match of this.eventList[sport]){
            if (match.getState() == "NS") lst.push(match.toJson());
        }
        return lst;
    }

    // Returns an event
    getEvent(sport,id){
        return this.eventList[sport][id].toJson();
    }

    // Activates superodds in a given 
    superOdds(sport, id,multiplier){
        if (this.eventList[sport][id] != undefined){
            this.eventList[sport][id].superOdds(multiplier);
        }
    }

    closeEvent(sport,id){
        if (this.eventList[sport][id] != undefined){
            this.eventList[sport][id].closeEvent();
        }
    }


}

module.exports = EventList;