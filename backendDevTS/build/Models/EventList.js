"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventList = void 0;
/**
 * @file EventList,js
 *
 */
const RaceEvent_1 = require("./RaceEvent");
const NoTieEvent_1 = require("./NoTieEvent");
const TieEvent_1 = require("./TieEvent");
const SportEvent_1 = require("./SportEvent");
const BETODDREL = 0.001;
let instance = undefined;
class EventList {
    constructor() {
        this.eventList = {};
        this.leagues = {};
    }
    /**
     * Creates an instance of the EventList class if it does not exist,
     * else returns the existing one
     * @returns Returns the singleton instance of this class
     */
    static getInstance() {
        if (instance == undefined) {
            instance = new EventList();
        }
        return instance;
    }
    /**
     * Adds a event to the event list where a draw is not a possible outcome
    * @param {string} sport Name of the sport
    * @param {string} league Name of the league
    * @param {string} id Identifier of the event
    * @param {string} datetime Starting datetime of the event
    * @param {string} team1 Name of the home team
    * @param {string} team2 Name of the away team
    * @param {string} logo1 Url to the logo of the home team
    * @param {string} logo2 URL to the logo of the away team
    * @param {string} odds1 Odds of the home team winning
    * @param {string} odds2 Odds of the away team winning
    */
    addNoTieEventFromAPI(sport, league, id, datetime, team1, team2, logo1, logo2, odds1, odds2) {
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
            this.leagues[sport] = [];
        }
        let event = this.eventList[sport][id];
        if (event == undefined) {
            let description = team1 + " - " + team2;
            this.eventList[sport][id] = new NoTieEvent_1.NoTieEvent(sport, league, id, description, -1, "NODD", datetime, team1, team2, logo1, logo2, odds1, odds2);
            if (!this.leagues[sport].includes(league))
                this.leagues[sport].push(league);
        }
        else if (!(event instanceof NoTieEvent_1.NoTieEvent)) {
            this.eventList[sport][id] = new NoTieEvent_1.NoTieEvent(sport, league, id, event.getDescription(), event.getResult(), event.getState(), datetime, team1, team2, logo1, logo2, odds1, odds2);
        }
    }
    /**
     * Adds a event to the event list where a draw is a possible outcome
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} datetime Date and time of the event
     * @param {string} team1 Name of the home team
     * @param {string} team2 Name of the away team
     * @param {string} logo1 URL with the logo of the home team
     * @param {string} logo2 URL with the logo of the away team
     * @param {number} oddsHome Initial Odds of winning for home team for event
     * @param {number} oddsAway Initial Odds of winning for away team for event
     * @param {number} oddsDraw Initial Odds of a draw for event
     */
    addTieEventFromAPI(sport, league, id, datetime, team1, team2, logo1, logo2, oddsHome, oddsAway, oddsDraw) {
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
            this.leagues[sport] = [];
        }
        let event = this.eventList[sport][id];
        if (event == undefined) {
            let description = team1 + " - " + team2;
            this.eventList[sport][id] = new TieEvent_1.TieEvent(sport, league, id, description, -1, "NODD", datetime, team1, team2, logo1, logo2, oddsHome, oddsAway, oddsDraw);
            if (!this.leagues[sport].includes(league))
                this.leagues[sport].push(league);
        }
        else if (!(event instanceof TieEvent_1.TieEvent)) {
            this.eventList[sport][id] = new TieEvent_1.TieEvent(sport, league, id, event.getDescription(), event.getResult(), event.getState(), datetime, team1, team2, logo1, logo2, oddsHome, oddsAway, oddsDraw);
        }
    }
    /**
     * Adds a race event to the event list
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} datetime Date and time of the event
     * @param {string[]} pilots List of names of the pilots participating in the race
     * @param {string[]} pilotsPhotos List of urls for each pilots face
     * @param {string} circuit Name of the circuit
     * @param {string} circuitPhoto Url for the circuit photo
     * @param {number[]} playerOdds List of odds for each contestant
     */
    addRaceEventFromAPI(sport, league, id, datetime, pilots, pilotsPhotos, circuit, circuitPhoto, playerOdds) {
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
            this.leagues[sport] = [];
        }
        let event = this.eventList[sport][id];
        if (event == undefined) {
            this.eventList[sport][id] = new RaceEvent_1.RaceEvent(sport, league, id, circuit, -1, "NODD", datetime, pilots, pilotsPhotos, circuit, circuitPhoto, playerOdds);
            if (!this.leagues[sport].includes(league))
                this.leagues[sport].push(league);
        }
        else if (!(event instanceof RaceEvent_1.RaceEvent)) {
            this.eventList[sport][id] = new RaceEvent_1.RaceEvent(sport, league, id, event.getDescription(), event.getResult(), event.getState(), datetime, pilots, pilotsPhotos, circuit, circuitPhoto, playerOdds);
        }
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
    addEventFromDB(sport, league, id, description, result, state, datetime) {
        if (this.eventList[sport] == undefined) {
            this.eventList[sport] = {};
            this.leagues[sport] = [];
        }
        this.eventList[sport][id] = new SportEvent_1.SportEvent(sport, league, id, description, result, state, datetime);
        if (!this.leagues[sport].includes(league))
            this.leagues[sport].push(league);
    }
    /**
     * Method that alters the odd for a specific event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of event
     * @param {number[]} odds List of odds to be assigned
     * @returns Returns true if the odds were added correctly
     */
    changeEventOdd(sport, id, odds) {
        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "NODD") {
            if (this.eventList[sport][id] instanceof RaceEvent_1.RaceEvent || this.eventList[sport][id] instanceof NoTieEvent_1.NoTieEvent || this.eventList[sport][id] instanceof TieEvent_1.TieEvent) {
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
    updateOddBet(sport, id, money, choice) {
        let odds = [];
        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState() == "BET") {
            if (this.eventList[sport][id] instanceof RaceEvent_1.RaceEvent || this.eventList[sport][id] instanceof NoTieEvent_1.NoTieEvent || this.eventList[sport][id] instanceof TieEvent_1.TieEvent) {
                odds = this.eventList[sport][id].getOdds();
                for (let i = 0; i < odds.length; i++) {
                    if (i != choice)
                        odds[i] += money * BETODDREL;
                    else if (odds[i] > 1 + money * BETODDREL)
                        odds[i] -= money * BETODDREL;
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
    getNODDEvents(sport) {
        let lst = [];
        for (let match in this.eventList[sport]) {
            if (this.eventList[sport][match].getState() == "NODD") {
                lst.push((this.eventList[sport][match]).toJson());
            }
        }
        return lst.sort((a, b) => {
            return new Date(a["Data"]) - new Date(b["Data"]);
        });
    }
    /**
     * Returns a list of events ready for receiving bets
     * @param {string} sport Name of the sport
     * @returns A list of events ready for receiving bets
     */
    getBETEvents(sport) {
        let lst = [];
        for (let match in this.eventList[sport]) {
            if (this.eventList[sport][match].getState() == "BET")
                lst.push(this.eventList[sport][match].toJson());
        }
        return lst.sort((a, b) => {
            return new Date(a["Data"]) - new Date(b["Data"]);
        });
    }
    /**
     * Returns a event object that the DB is ready to parse
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of a sport
     * @returns Returns a JSON that the DB is ready to parse
     */
    getEventDB(sport, id) {
        if (this.eventList[sport][id] != undefined)
            return this.eventList[sport][id].toDB();
        else
            return null;
    }
    /**
     * Updates the winner of a given event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @param {number} result The result of the event
     * @param {string} description Updated description
     */
    updateWinner(sport, id, result, description) {
        this.eventList[sport][id].updateWinner(result, description);
    }
    /**
     * Activate super odds in a given event
     * @param {string} sport Name of the support
     * @param {string} id Identifier of the event
     * @param {number} multiplier Multiplier of the odd
     * @returns Returns true if the supper odd was activated in the specific event
     */
    superOdds(sport, id, multiplier) {
        if (this.eventList[sport][id] != undefined && this.eventList[sport][id].getState == "BET" && !this.eventList[sport][id].isSuperOddsOn()) {
            this.eventList[sport][id].superOdds(multiplier);
            return true;
        }
        else
            return false;
    }
    /**
     * Closes an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns true if the event was closed, and false otherwise
     */
    closeEvent(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            this.eventList[sport][id].closeEvent();
            return true;
        }
        else
            return false;
    }
    /**
     * Returns the participants of an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns a list of participants in the event
     */
    getParticipants(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            return this.eventList[sport][id].getParticipants();
        }
        else
            return [];
    }
    /**
     * Returns the odds for the results of a given event
     * @param {string} sport
     * @param {string} id
     * @returns REturns a list of odds
     */
    getOdds(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            return this.eventList[sport][id].getOdds();
        }
        else
            return [];
    }
    /**
     * Returns the state of a given sport event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns the state of the event
     */
    getState(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            return this.eventList[sport][id].getState();
        }
        else
            return null;
    }
    /**
     * Returns the description for an event
     * @param {string} sport Name of the sport
     * @param {string} id Identifier of the event
     * @returns Returns a string containing the description of an event
     */
    getDescription(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            return this.eventList[sport][id].getDescription();
        }
        else
            return null;
    }
    /**
      * Returns the result for an event
      * @param {string} sport Name of the sport
      * @param {string} id Identifier of the event
      * @returns Returns a string containing the result of an event
      */
    getResult(sport, id) {
        if (this.eventList[sport][id] != undefined) {
            return this.eventList[sport][id].getResult();
        }
        else
            return null;
    }
    /**
     * Returns the leagues with sport events
     * @param {string} sport
     * @returns A list of strings representing the leagues
     */
    getLeagues(sport) {
        if (this.leagues[sport] != undefined) {
            return this.leagues[sport];
        }
        else
            return [];
    }
    /**
     * Removes the events that have past dates (already happened)
     * @param {string} sport Sport from which to delete all past event
     */
    removePastEvents(sport) {
        let lst = [];
        for (let event of Object.values(this.eventList[sport])) {
            let date = event.getDate();
            if (Date.parse(date) < Date.now()) {
                lst.push(event.getID());
            }
        }
        for (let id of lst) {
            delete this.eventList[sport][id];
        }
    }
}
exports.EventList = EventList;
