const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses")
import {makeRequest} from "./APICommunicationTools"
import fs from 'fs';

export class FutPTAPICommunication implements SportAPICommunication{
    eventList:IUpdateEvents;
    filePath: string;
    

    public constructor(eventList:IUpdateEvents, path:string){
        this.eventList = eventList;
        this.filePath = path + "futPT.json";
    }
    

    fetchNewEvents(): void {
        let req = this.generateFetchRequest();
        makeRequest(req, (response:any)=>{
            this.parseFetchResponse(response);
            if (STORE_RES) fs.writeFile(this.filePath, JSON.stringify(response), { flag: 'w+' }, () =>{});
        }).catch((error)=>{console.log("Error in FutPT events fetch.Trying to read cached file!"); this.fetchCachedEvents()});
    }

    fetchCachedEvents(): void {
        let existsFile = fs.existsSync(this.filePath);
        if (existsFile){
            let cachedResponse = JSON.parse(fs.readFileSync(this.filePath,"utf-8"));
            this.parseFetchResponse(cachedResponse);
        }else console.error("Unable to fetch the cached file for FUTPT")
    }

    async updateEvents(events:string[]):Promise<void>{
        let req = this.generateUpdateRequest();
        await makeRequest(req,(response:any)=>{
            this.parseUpdateResponse(response,events);

        }).catch((error)=>{console.log("Error in FutPT events update")});
        this.eventList.removePastEvents("FUTPT",events);
        this.fetchNewEvents();
    }


    generateFetchRequest(): any {
        return {
            method: 'get',
            url: 'http://ucras.di.uminho.pt/v1/games/'
          }
    }

    generateUpdateRequest(){
        return {
            method: 'get',
            url: 'http://ucras.di.uminho.pt/v1/games/'
          }
    }


    parseFetchResponse(response:any): void {
        for (let match of response){
            let id = match.id;
            let date = match.commenceTime;
            //if (Date.parse(date) > Date.now()){ 
                let league = "Primeira Liga";
                let team1 = match.homeTeam;
                let team2 = match.awayTeam;
                let sOdds1 = undefined;
                let sOdds2 = undefined;
                let sOddsTie = undefined;
    
                for (let outcomes of match.bookmakers[0].markets[0].outcomes){
                    if (outcomes.name == team1) sOdds1 = outcomes.price;
                    else if(outcomes.name == team2) sOdds2 = outcomes.price;
                    else if(outcomes.name == "Draw") sOddsTie = outcomes.price;
                }
               this.eventList.addTieEventFromAPI("FUTPT",league,id,date,team1,team2,"","",sOdds1,sOdds2,sOddsTie);
            //}
        }
    }

        
    parseUpdateResponse(response:any, games:any): void {
        for (let game of games){
            for (let match of response){
                let id = match.id;
                if (id == game && match.completed){       
                    const re = /(\d)x(\d)/;
                    let lst = match.scores.match(re);
                    let home = match.homeTeam;
                    let away = match.awayTeam;
                    let result =-1;
                    if (lst[1] > lst[2]) result = 0;
                    else if (lst[1] < lst[2]) result = 1;
                    if (lst[1] == lst[2]) result = 2;
                    this.eventList.updateWinner("FUTPT",game,result,"(" + lst[1]+")" + home +" - "+away +"(" + lst[2]+")" );
                    break;
                }
            }
        }

    }



}