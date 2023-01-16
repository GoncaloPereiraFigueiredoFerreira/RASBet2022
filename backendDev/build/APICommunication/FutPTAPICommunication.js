"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutPTAPICommunication = void 0;
const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses");
const APICommunicationTools_1 = require("./APICommunicationTools");
const fs_1 = __importDefault(require("fs"));
class FutPTAPICommunication {
    constructor(eventList, path) {
        this.eventList = eventList;
        this.filePath = path + "futPT.json";
    }
    fetchNewEvents() {
        let req = this.generateFetchRequest();
        (0, APICommunicationTools_1.makeRequest)(req, (response) => {
            this.parseFetchResponse(response);
            if (STORE_RES)
                fs_1.default.writeFile(this.filePath, JSON.stringify(response), { flag: 'w+' }, () => { });
        }).catch((error) => { console.log("Error in FutPT events fetch.Trying to read cached file!"); this.fetchCachedEvents(); });
    }
    fetchCachedEvents() {
        let existsFile = fs_1.default.existsSync(this.filePath);
        if (existsFile) {
            let cachedResponse = JSON.parse(fs_1.default.readFileSync(this.filePath, "utf-8"));
            this.parseFetchResponse(cachedResponse);
        }
        else
            console.error("Unable to fetch the cached file for FUTPT");
    }
    updateEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            let req = this.generateUpdateRequest();
            yield (0, APICommunicationTools_1.makeRequest)(req, (response) => {
                this.parseUpdateResponse(response, events);
            }).catch((error) => { console.log("Error in FutPT events update"); });
            this.eventList.removePastEvents("FUTPT", events);
            this.fetchNewEvents();
        });
    }
    generateFetchRequest() {
        return {
            method: 'get',
            url: 'http://ucras.di.uminho.pt/v1/games/'
        };
    }
    generateUpdateRequest() {
        return {
            method: 'get',
            url: 'http://ucras.di.uminho.pt/v1/games/'
        };
    }
    parseFetchResponse(response) {
        for (let match of response) {
            let id = match.id;
            let date = match.commenceTime;
            //if (Date.parse(date) > Date.now()){ 
            let league = "Primeira Liga";
            let team1 = match.homeTeam;
            let team2 = match.awayTeam;
            let sOdds1 = undefined;
            let sOdds2 = undefined;
            let sOddsTie = undefined;
            for (let outcomes of match.bookmakers[0].markets[0].outcomes) {
                if (outcomes.name == team1)
                    sOdds1 = outcomes.price;
                else if (outcomes.name == team2)
                    sOdds2 = outcomes.price;
                else if (outcomes.name == "Draw")
                    sOddsTie = outcomes.price;
            }
            this.eventList.addTieEventFromAPI("FUTPT", league, id, date, team1, team2, "", "", sOdds1, sOdds2, sOddsTie);
            //}
        }
    }
    parseUpdateResponse(response, games) {
        for (let game of games) {
            for (let match of response) {
                let id = match.id;
                if (id == game && match.completed) {
                    const re = /(\d)x(\d)/;
                    let lst = match.scores.match(re);
                    let home = match.homeTeam;
                    let away = match.awayTeam;
                    let result = -1;
                    if (lst[1] > lst[2])
                        result = 0;
                    else if (lst[1] < lst[2])
                        result = 1;
                    if (lst[1] == lst[2])
                        result = 2;
                    this.eventList.updateWinner("FUTPT", game, result, "(" + lst[1] + ")" + home + " - " + away + "(" + lst[2] + ")");
                    break;
                }
            }
        }
    }
}
exports.FutPTAPICommunication = FutPTAPICommunication;
