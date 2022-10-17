const axios       = require('axios');
const fs          = require('fs');
const cnf         = require('config');
const getRequests = require("./Requests");
const parser      = require("./ResponseParsing");

const API_AUTH_KEY = cnf.get("API_AUTH_KEY");
const rspPath = cnf.get("responsePath");


function makeRequest(request,path,callback){
    axios(request)
    .then(function (response) {
      if (response == null || response.data.errors.length != 0){
        console.error("Errors found in response!\n")
        response.data.errors.map(x=> console.log(JSON.stringify(x)));
      }
      else{
        callback(response.data);
        fs.writeFileSync(path, JSON.stringify(response.data), { flag: 'w+' }, () =>{});
      }
    })
    .catch((error)=>{
      console.error(error);
    })
}

function initEventLst(){
    let configFlag = cnf.get("update_on_startup");

    /// Futebol Events
    let futLeagueDic = cnf.get("futebol_league_id");
    let futpath = "";
    for (let league in futLeagueDic){

      futpath = rspPath + "fut" + futLeagueDic[league] + "res.json";
      if (configFlag || !fs.existsSync(futpath)){
        let req = getRequests.genFutRequest(API_AUTH_KEY,futLeagueDic[league],2022);
        makeRequest(req,futpath,parser.parseFutResp);
      }
      else{
        let json = JSON.parse(fs.readFileSync(futpath,"utf-8"));
        parser.parseFutResp(json);
      }
  
    }
}

module.exports = {initEventLst};