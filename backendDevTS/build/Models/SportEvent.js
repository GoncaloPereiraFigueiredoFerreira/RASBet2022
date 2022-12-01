"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportEvent = void 0;
class SportEvent {
    /**
     * @param {string} sport Name of the sport
     * @param {string} league Name of the league
     * @param {string} id Identifier of the event
     * @param {string} description String that contains the description of the event
     * @param {number} result Result of the event
     * @param {string} state State of the event
     * @param {string} datetime Date and time of the event
     */
    constructor(sport, league, id, description, result, state, datetime) {
        this.Sport = sport;
        this.League = league;
        this.Id = id;
        this.Description = description;
        this.Result = result;
        this.State = state;
        this.DateTime = datetime;
        this.SuperOdds = false;
    }
    /**
     * Method responsible for updating the result of the event
     * @param {number} result Result of the event
     * @param {string} description New description the event
     */
    updateWinner(result, description) {
        this.Description = description;
        this.Result = result;
        this.State = "FIN";
    }
    /**
     *
     * @returns Returns the sport of this event
     */
    getSport() {
        return this.Sport;
    }
    /**
     *
     * @returns Returns the identifier of the event
     */
    getID() {
        return this.Id;
    }
    /**
     *
     * @returns Returns the state of the event
     */
    getState() {
        return this.State;
    }
    /**
     *
     * @returns Returns the league on which the event is part off
     */
    getLeague() {
        return this.League;
    }
    /**
     *
     * @returns Return the description of the event
     */
    getDescription() {
        return this.Description;
    }
    /**
     *
     * @returns Return the result of the event
     */
    getResult() {
        return this.Result;
    }
    /**
     * Methods that changes the state of a event without odds to a ready for bets event
     */
    readyEvent() {
        if (this.State == "NODD") {
            this.State = "BET";
        }
    }
    /**
     * Closes the event
     */
    closeEvent() {
        this.State = "CLS";
    }
    /**
     * @returns Returns a json object to be used in the DB
     */
    toDB() {
        return {
            "ID": this.Id,
            "DataEvent": this.DateTime,
            "Descricao": this.Description,
            "Resultado": this.Result,
            "Estado": this.State,
            "Liga": this.League,
            "Desporto": this.Sport
        };
    }
    /**
     * @returns Returns true if the superodds is activated
     */
    isSuperOddsOn() {
        return this.SuperOdds;
    }
    /**
     *
     * @returns Returns the date and time of the event
     */
    getDate() {
        return this.DateTime;
    }
}
exports.SportEvent = SportEvent;
module.exports = SportEvent;
