/**
 * @file EventList,js
 * @author Gonçalo Ferreira
 * 
 */

const RaceEvent = require("./RaceEvent");
const NoTieEvent = require("./NoTieEvent");
const TieEvent = require("./TieEvent");
const SportEvent = require("./SportEvent");

let instance = undefined

class EventList{

    constructor(){
        this.eventList = {};
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

    addEventFromAPI(event){
        if (this.eventList[event.getSport()] == undefined) {
            this.eventList[event.getSport()] = {};
        }
        this.eventList[event.getSport()][event.getID()] = event;
    }

    addEventFromDB(sport,league,id,description,result,state,datetime){
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
        }
        this.eventList[sport][id] = new SportEvent(sport,league,id,description,result,state,datetime);
    }

    getEvent(sport,id){
        if (this.eventList[sport] != undefined && this.eventList[sport][id]){
            return this.eventList[sport][id];
        }
        else return undefined;
    }

    /// Method that alters the inital odd for an event
    changeEventOdd(sport,id,odds){

        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "NODD"){

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
                return true;
        }
        return false;

    }

    /// Returns a list of events without Odds
    getNODDEvents(sport){
        let lst = [];
        for(let match in this.eventList[sport]){
            if (this.eventList[sport][match].getState() == "NODD") {
                if (this.eventList[sport][match] instanceof TieEvent){
                    lst.push(this.eventList[sport][match].toJsonV2());
                }
                else{
                    lst.push(this.eventList[sport][match].toJson()); 
                }
            }
        }
        return lst.sort((a,b)=>{
            return new Date(b["Data"]) -new Date(a["Data"]) 

        });
    }

    /// Returns the list of events ready for bets
    getBETEvents(sport){
        let lst = [];
        for(let match in this.eventList[sport]){
            if (this.eventList[sport][match].getState() == "BET") lst.push(this.eventList[sport][match].toJson());
        }
        return lst.sort((a,b)=>{
            return new Date(b["Data"]) -new Date(a["Data"]) 

        });
    }

    // Returns an event to the front end
    getEventFE(sport,id){
        if (this.eventList[sport][id] != undefined)
            return this.eventList[sport][id].toJson();

        else return null;
    }

    // Returns an event to the DB
    getEventDB(sport,id){
        if (this.eventList[sport][id] != undefined)
            return this.eventList[sport][id].toDB();

        else return null;
    }


    // Change result of an event
    updateWinner(sport,id,result,description){
        this.eventList[sport][id].updateWinner(result,description);
    }

    // Activates superodds in a given 
    superOdds(sport, id,multiplier){
        if (this.eventList[sport][id] != undefined && !this.eventList[sport][id].isSuperOddsOn()){
            this.eventList[sport][id].superOdds(multiplier);
            return true;
        }
        else return false;
    }

    closeEvent(sport,id){
        if (this.eventList[sport][id] != undefined){
            this.eventList[sport][id].closeEvent();
            return true;
        }
        else return false;
    }

    getParticipants(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getParticipants();

        }
        else return null;
    }
    getOdds(sport,id){
        if (this.eventList[sport][id] != undefined){
            
            return this.eventList[sport][id].getOdds();;
        }
        else return null;
    }


    getState(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getState();
        }
        else return null;
    }

    toDb(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].toDB();
        }
        else return null;
    }

    getDescription(sport,id){
        if (this.eventList[sport][id] != undefined){
            return this.eventList[sport][id].getDescription();
        }
        else return null;
    }
    
    

}

module.exports = EventList;