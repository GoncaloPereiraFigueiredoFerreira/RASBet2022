import { EventList } from "../Models/EventList"
import { BasketballAPICommunication } from "./BasketAPICommunication"
import { FutPTAPICommunication } from "./FutPTAPICommunication"
import { F1APICommunication } from "./F1APICommunication"
import { FutebolAPICommunication } from "./FutebolAPICommunication"
import { NFLAPICommunication } from "./NFLAPICommunication"


const cnf     = require('config');
const rspPath = cnf.get("responsePath");
const update_on_startup:boolean = cnf.get("update_on_startup");

export class APICommunicationHub{
    sportsAPIs: {[sport :string]: SportAPICommunication}
    startup: boolean;
    constructor(){
        const evLst:IUpdateEvents = EventList.getUpdateEventsInstance();
        this.sportsAPIs = {}
        this.sportsAPIs["FUT"]  = new FutebolAPICommunication(evLst,rspPath);
        this.sportsAPIs["FUTPT"]= new FutPTAPICommunication(evLst,rspPath);
        this.sportsAPIs["F1"]   = new F1APICommunication(evLst,rspPath);
        this.sportsAPIs["BSK"]  = new BasketballAPICommunication(evLst,rspPath);
        this.sportsAPIs["NFL"]  = new NFLAPICommunication(evLst,rspPath);
        this.startup = true;
    }

    fetchEvents(){
        for (let sport of Object.keys(this.sportsAPIs)){
            if (this.startup && !update_on_startup)  {this.sportsAPIs[sport].fetchCachedEvents();}
            else {this.sportsAPIs[sport].fetchNewEvents();}
        }
        if (this.startup) this.startup=false;
    }
    
    updateEvents(sport:string,events:string[]){
        return new Promise<void>(async(resolve,reject) =>{ await this.sportsAPIs[sport].updateEvents(events); resolve()});
    }
    


}