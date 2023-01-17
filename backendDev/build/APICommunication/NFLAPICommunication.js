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
exports.NFLAPICommunication = void 0;
const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses");
const APICommunicationTools_1 = require("./APICommunicationTools");
const fs_1 = __importDefault(require("fs"));
class NFLAPICommunication {
    constructor(eventList, path) {
        this.eventList = eventList;
        this.filePath = path + "nfl" + "Res.json";
    }
    fetchNewEvents() {
        let req = this.generateFetchRequest(API_AUTH_KEY, 2022);
        (0, APICommunicationTools_1.makeRequest)(req, (response) => {
            this.parseFetchResponse(response);
            if (STORE_RES)
                fs_1.default.writeFile(this.filePath, JSON.stringify(response), { flag: 'w+' }, () => { });
        }).catch((error) => { console.warn("Error in nfl events fetch: " + error + "\n\nTrying to read cached files!"); this.fetchCachedEvents(); });
    }
    fetchCachedEvents() {
        let existsFile = fs_1.default.existsSync(this.filePath);
        if (existsFile) {
            let cachedResponse = JSON.parse(fs_1.default.readFileSync(this.filePath, "utf-8"));
            this.parseFetchResponse(cachedResponse);
        }
        else
            console.error("Error: Can't find cached file for NFL events");
    }
    updateEvents(events) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let game of events) {
                let req = this.generateUpdateRequest(API_AUTH_KEY, game);
                yield (0, APICommunicationTools_1.makeRequest)(req, (response) => {
                    this.parseUpdateResponse(response);
                }).catch(() => console.error("Error in the NFL update request"));
            }
            this.eventList.removePastEvents("NFL", events);
            this.fetchNewEvents();
        });
    }
    generateFetchRequest(api_key, season) {
        return {
            method: 'GET',
            url: 'https://v1.american-football.api-sports.io/games',
            params: { "league": 1, "season": season },
            headers: {
                'x-rapidapi-host': 'v1.american-football.api-sports.io',
                'x-rapidapi-key': api_key
            }
        };
    }
    generateUpdateRequest(api_key, id) {
        return {
            method: 'GET',
            url: 'https://v1.american-football.api-sports.io/games',
            params: { id: id },
            headers: {
                'x-rapidapi-host': 'v1.american-football.api-sports.io',
                'x-rapidapi-key': api_key
            }
        };
    }
    parseFetchResponse(response) {
        if (response.errors.length != 0) {
            console.error("Errors found in json response");
            console.log(response.errors);
        }
        else {
            for (let game of response.response) {
                if (game.game.status.short == "NS") {
                    let id = game.game.id;
                    let date = game.game.date.date;
                    let league = "NFL";
                    let team1 = game.teams.home.name;
                    if (team1 == null)
                        team1 = "TBD";
                    let team2 = game.teams.away.name;
                    if (team2 == null)
                        team2 = "TBD";
                    let logo1 = game.teams.home.logo;
                    let logo2 = game.teams.away.logo;
                    this.eventList.addTieEventFromAPI("NFL", league, id, date, team1, team2, logo1, logo2, 1, 1, 1);
                }
            }
        }
    }
    parseUpdateResponse(response) {
        if (response.errors.length != 0) {
            console.error("Errors found in response response");
            console.log(response.errors);
        }
        else {
            let id = response.response[0].id;
            let result = -1;
            let scores = response.response[0].scores;
            let team1 = response.response[0].teams.home.name;
            let team2 = response.response[0].teams.away.name;
            if (scores.home.total != null && scores.away.total != null) {
                if (scores.home.total > scores.away.total)
                    result = 0;
                else if (scores.home.total < scores.away.total)
                    result = 1;
            }
            if (result != -1)
                this.eventList.updateWinner("NFL", id, result, "(" + scores.home.total + ")" + " " + team1 + " - " + team2 + " " + "(" + scores.home.total + ")");
        }
    }
}
exports.NFLAPICommunication = NFLAPICommunication;
