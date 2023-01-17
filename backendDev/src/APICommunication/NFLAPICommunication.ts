const cnf = require('config');
const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const STORE_RES = cnf.get("store_responses")
import {makeRequest} from "./APICommunicationTools"
import fs from 'fs';

export class NFLAPICommunication implements SportAPICommunication{
    eventList:IUpdateEvents;
    filePath: string;
    

    public constructor(eventList:IUpdateEvents, path:string){
        this.eventList = eventList;
        this.filePath = path + "nfl" + "Res.json";
    }

    fetchNewEvents(): void {
        let req = this.generateFetchRequest(API_AUTH_KEY,2022);
        makeRequest(req, (response:any)=>{
            this.parseFetchResponse(response);
            if (STORE_RES) fs.writeFile(this.filePath, JSON.stringify(response), { flag: 'w+' }, () =>{});
        }).catch((error)=>{console.warn("Error in nfl events fetch: "+error+"\n\nTrying to read cached files!"); this.fetchCachedEvents()});
    }

    fetchCachedEvents(): void {
        let existsFile = fs.existsSync(this.filePath);
        if (existsFile){
            let cachedResponse = JSON.parse(fs.readFileSync(this.filePath,"utf-8"));
            this.parseFetchResponse(cachedResponse);
        }else console.error("Error: Can't find cached file for NFL events")
    }

    async updateEvents(events:string[]):Promise<void>{
        for (let game of events){
            let req = this.generateUpdateRequest(API_AUTH_KEY,game);
            await makeRequest(req,(response:any)=>{
                this.parseUpdateResponse(response);

            }
            ).catch(()=>
                console.error("Error in the NFL update request")
            );
        }
        this.eventList.removePastEvents("NFL",events);
        this.fetchNewEvents();
       
    }


    generateFetchRequest(api_key:string,season:number): any {
        return {

            method: 'GET',
            url: 'https://v1.american-football.api-sports.io/games',
            params: { "league": 1, "season":season},
            headers: {
              'x-rapidapi-host': 'v1.american-football.api-sports.io',
              'x-rapidapi-key': api_key
            }
          };
    }

    generateUpdateRequest(api_key:string,id:string){
        return {
            method: 'GET',
            url: 'https://v1.american-football.api-sports.io/games',
            params: {id: id},
            headers: {
              'x-rapidapi-host': 'v1.american-football.api-sports.io',
              'x-rapidapi-key': api_key
            }
          };
    }


    parseFetchResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in json response");
            console.log(response.errors)
        }
        else{
            for (let game of response.response){
                if (game.game.status.short == "NS"){
                   let id = game.game.id;
                   let date = game.game.date.date;
                   let league = "NFL";
                   let team1 = game.teams.home.name;
                   if (team1== null) team1= "TBD";
                   let team2 = game.teams.away.name;
                   if (team2== null) team2= "TBD";
                   let logo1 = game.teams.home.logo;
                   let logo2 = game.teams.away.logo;
                   this.eventList.addTieEventFromAPI("NFL",league,id,date,team1,team2,logo1,logo2,1,1,1)
                }
            }
        }
    }

        
    parseUpdateResponse(response:any): void {
        if (response.errors.length != 0) {
            console.error("Errors found in response response");
            console.log(response.errors)
        }
        else {
            let id = response.response[0].id;
            let result = -1;
            let scores =response.response[0].scores;
            let team1 = response.response[0].teams.home.name;
            let team2 = response.response[0].teams.away.name;
            if (scores.home.total != null &&  scores.away.total != null){
                if (scores.home.total > scores.away.total) result = 0;
                else if (scores.home.total < scores.away.total) result = 1;
            }
            if (result != -1) this.eventList.updateWinner("NFL",id,result,"("+scores.home.total+")" + " " + team1 + " - "+team2 + " "+ "("+scores.home.total+")");   
        }
    }
    



}