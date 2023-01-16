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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APICommunicationHub = void 0;
const EventList_1 = require("../Models/EventList");
const BasketAPICommunication_1 = require("./BasketAPICommunication");
const FutPTAPICommunication_1 = require("./FutPTAPICommunication");
const F1APICommunication_1 = require("./F1APICommunication");
const FutebolAPICommunication_1 = require("./FutebolAPICommunication");
const NFLAPICommunication_1 = require("./NFLAPICommunication");
const cnf = require('config');
const rspPath = cnf.get("responsePath");
const update_on_startup = cnf.get("update_on_startup");
class APICommunicationHub {
    constructor() {
        const evLst = EventList_1.EventList.getUpdateEventsInstance();
        this.sportsAPIs = {};
        this.sportsAPIs["FUT"] = new FutebolAPICommunication_1.FutebolAPICommunication(evLst, rspPath);
        this.sportsAPIs["FUTPT"] = new FutPTAPICommunication_1.FutPTAPICommunication(evLst, rspPath);
        this.sportsAPIs["F1"] = new F1APICommunication_1.F1APICommunication(evLst, rspPath);
        this.sportsAPIs["BSK"] = new BasketAPICommunication_1.BasketballAPICommunication(evLst, rspPath);
        this.sportsAPIs["NFL"] = new NFLAPICommunication_1.NFLAPICommunication(evLst, rspPath);
        this.startup = true;
    }
    fetchEvents() {
        for (let sport of Object.keys(this.sportsAPIs)) {
            if (this.startup && !update_on_startup) {
                this.sportsAPIs[sport].fetchCachedEvents();
            }
            else {
                this.sportsAPIs[sport].fetchNewEvents();
            }
        }
        if (this.startup)
            this.startup = false;
    }
    updateEvents(sport, events) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () { yield this.sportsAPIs[sport].updateEvents(events); resolve(); }));
    }
}
exports.APICommunicationHub = APICommunicationHub;
