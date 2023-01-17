import {EventList} from "./Models/EventList";
import {DBCommunication} from "./DBCommunication/DBCommunication";
import {NotificationHandler} from "./SessionControl/NotificationHandler";
import { AuthenticationHandler } from "./SessionControl/Security";
import {Apostador,Transacao,Promocao,Aposta,Evento} from './DBCommunication/DBclasses';
import { APICommunicationHub } from "./APICommunication/APICommunicationHub";
import { MessageGenerator } from './MessageGenerator';
const MsgGen = new MessageGenerator()

const evLst:IControlEvents = EventList.getControlEventsInstance()
const apiComms = new APICommunicationHub();
const dbComms = new DBCommunication();
const notificationHandler:INotificationHandler = NotificationHandler.getInstance();
const authHandler = new AuthenticationHandler();
const bcrypt = require('bcrypt')

require("dotenv").config();


export class RequestHandler implements IRequestHandler{
    constructor(){
        //this.updateEvents = this.updateEvents.bind(this);
        
    }

    dummyFunction(request:any,response:any){
        response.status(200).send("Dummy here! But connection worked!")
    }

    

    /**
     * Function that deals with a http request to register an account in the database
     * 
     */
    async registerFunction(request:any,response:any){
       
        let apostador = new Apostador(request.body)
       
        apostador.PlvPasse = await bcrypt.hash(apostador.PlvPasse,10)
        
        apostador.Balance=0
       
        const userInfo = {
            userInfo:{
                email:apostador.Email,
                role:'apostador'
            }
        }
       
        dbComms.registerOnDb(apostador).then(()=>{
           
            const token = authHandler.generateAccessToken(userInfo)
            
            return  authHandler.generateRefreshToken(userInfo,dbComms).then((refreshToken)=>{
               
                //response.status(200).send({"AccessToken":token,"RefreshToken":refreshToken})
                response.status(200).send({"Token":token,"RefreshToken":refreshToken})

            })
            
        }).catch((message:any)=>{
            
            response.status(400).send(message)
        })
    }

    /**
     * Function that deals with a http request to make a transaction 
     */

    transactionFunction(request:any,response:any){
        
        let transacao = new Transacao(request.body)
        let userEmail = request.email

        transacao.ApostadorID = userEmail
        dbComms.transactionOnDb(transacao).then(()=>{
            return dbComms.walletOnDb(userEmail)
        }).then((message:number)=>{
            notificationHandler.addWalletNotification(userEmail,message);
            response.sendStatus(200);
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
        
    }


    /**
     * Function that deals with a http request to check if the given credentials are in the database
     */
    loginFunction(request:any,response:any){
        
        let Email= request.body.Email
        let PlvPasse= request.body.PlvPasse

        dbComms.loginOnDb(Email,PlvPasse).then((message:any)=>{
            
            const userInfo={
                userInfo:{
                    email:Email,
                    role:message.FRole
                }
            }
            
            //message['AccessToken'] = authHandler.generateAccessToken(userInfo)
            message['Token'] = authHandler.generateAccessToken(userInfo)
            return authHandler.generateRefreshToken(userInfo,dbComms).then((refreshToken:string)=>{
                message['RefreshToken'] = refreshToken
                response.status(200).send(message)
            }).catch((e:any)=>{
                return Promise.reject(e)
            })

        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }

    /**
     * Function that deals with a http request to logout 
     */
    logoutFunction(request:any,response:any){

        const refreshToken= request.body.refreshToken;
        console.log('QUERO DAR LOGOUT')
        
        dbComms.logoutOnDb(refreshToken).then((email:string)=>{
            console.log(`DEI LOGFOUT ${email}`)
            notificationHandler.closeConnection(email)
        }).catch((e)=>{
        
            response.status(400).send(e)
        })
        
    }

  
    /**
     * Function that deals with a http request to refresh the ACCESS_TOKEN 
     */
    refreshTokenFunction(request:any,response:any){
        
        authHandler.refreshAccessToken(request.body.refreshtoken,dbComms).then((accessToken:any)=>{
            if(accessToken==null) response.sendStatus(400)
            else response.status(200).send({'AccessToken':accessToken})
        }).catch((e:any)=>{
            response.status(400).send(e)
        })
    }


    /**
     * Function that deals with a http request to register a bet
     */
    registerBetFunction(request:any,response:any){

        let list:Evento[]=[]
        let userEmail = request.email
        let aposta = new Aposta(userEmail,request.body.Aposta)
        let Eventos = request.body.Eventos
        
        for(let i = 0 ; i< Eventos.length; i++){
            list.push(new Evento(evLst.getEventDB(Eventos[i].Desporto,Eventos[i].EventoID)))
        }
        
        dbComms.usedCodOnDb(aposta.ApostadorID,aposta.Codigo).then((message:any)=>{
        
            if(message.Res=="Sim"){ 
            
                return Promise.reject({"error":"Codigo promocional ja utilizado"})
            }
            return dbComms.registerEventOnDb(list)
        }).then(()=>{
            return  dbComms.registerBetOnDb(aposta,Eventos,aposta.Codigo)
        }).then(()=>{
            return dbComms.walletOnDb(userEmail)
        }).then((balanco:any)=>{
                
            for(let i = 0 ; i< Eventos.length; i++){

                evLst.updateOddBet(Eventos[i].Desporto,Eventos[i].EventoID,aposta.Montante,Eventos[i].Escolha);

                let odds = evLst.getOdds(Eventos[i].Desporto,Eventos[i].EventoID)
                const notification = MsgGen.generateMessage([Eventos[i].Desporto,Eventos[i].EventoID,odds],MsgGen.ODDS_CHANGED_MESSAGE)
                let followers = evLst.getGameFollowers(Eventos[i].Desporto,Eventos[i].EventoID)
             
                if( followers.length > 0)notificationHandler.addBetNotification(followers,notification)

                
            }
            notificationHandler.addWalletNotification(userEmail,balanco);
            response.sendStatus(200);

        }).catch((e:any)=>{
        
            response.status(400).send(e)
        })   
    }


    /**
     * Function that deals with a http request to edit a profile of an account
     */
    editProfileFunction(request:any,response:any){
        let list:string=""
        let size = Object.keys(request.body).length-1
        if(request.body.Morada){
            list+=`Morada='${request.body.Morada}'`
            size--
            if(size>0)list+=','
        }
        if(request.body.Nome){
            list+=`Nome='${request.body.Nome}'`
            size--
            if(size>0)list+=','
        }
        if(request.body.Telemovel){
            list+=`Telemovel='${request.body.Telemovel}'`
            size--
            if(size>0)list+=','
        }
        
        let userEmail = request.email
        
        dbComms.editProfileOnDb(list,userEmail).then((message:any)=>{
            
            response.status(200).send(message)
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }



    /**
     * Function that deals with a http request to close an event
     */
    closeEventFunction(request:any,response:any){

        let EventoID= request.body.Evento.EventoID
        let Desporto= request.body.Evento.Desporto
        
        dbComms.closeEventOnDb(EventoID,Desporto).then(async(message:any)=>{
        
            evLst.closeEvent(Desporto,EventoID);
            
            for(let triple of message.toNotify){

                const notification= MsgGen.generateMessage(triple[1],triple[2])

                //Send email and notification
                notificationHandler.addBetNotification([triple[0]],notification);
                
                // Notify wallet
                await dbComms.walletOnDb(triple[0]).then((info:number)=>{
                
                    notificationHandler.addWalletNotification(triple[0],info);
                }).catch((e)=>{
                    
                    return Promise.reject(e)
                });
            }
            response.status(200).send({'Res':message.Res})
            
        }).catch((message:any)=>{
            
            response.status(400).send(message)

        }) 
    }

    /**
     * Function that deals with a http request to add a promocional code to the database
     */
    addPromocaoFunction(request:any,response:any){

        let promocao = new Promocao(request.body.Promocao)

        dbComms.addPromocaoOnDb(promocao).then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
        
    }

    /**
     * Function that deals with a http request to remove a promocional code from the database
     */
    remPromocaoFunction(request:any,response:any){
       
        dbComms.remPromocaoOnDb(request.body.Codigo).then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }

    /**
     * Function that deals with a http request to get all existing promocional codes in the database
     */
    getpromocaoFunction(request:any,response:any){
            
        dbComms.getPromocaoOnDb().then((message:any)=>{
            response.status(200).send(message)
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    
    }

    /**
     * Function that deals with a http request to check if a given better already used a given promocional code
     */
    usedCodFunction(request:any,response:any){
        
        let userEmail = request.email
    
        dbComms.usedCodOnDb(userEmail,request.query.Codigo).then((message:any)=>{
            
            response.status(200).send(message)
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }

    /**
     * Function that deals with a http request to get the profile of a given account
     */
    profileInfoFunction(request:any,response:any){
      
        let userEmail = request.email
       
        
        dbComms.profileInfoOnDb(userEmail).then((message:any)=>{
            
            response.status(200).send(message) 

        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }

    /**
     * Function that deals with a http request to get the bet history of a given better
     */
    betHistoryFunction(request:any,response:any){

        let userEmail = request.email
        
        dbComms.betHistoryOnDb(userEmail).then(async(message:any)=>{
            
            response.status(200).send({'lista':message})
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }



    /**
     * Function that deals with a http request to get the transaction history of a given better
     */
    transHistFunction(request:any,response:any){
        
        let userEmail = request.email
            
        dbComms.transHistOnDb(userEmail).then((message:any)=>{
            
            response.status(200).send({'lista':message})
        }).catch((message:any)=>{
            response.status(400).send(message)
        })
    }

    /**
     *  Handler for the request of a event list. This event list changes based on the user thats requesting it and 
     */
    returnEventList(request:any,response:any){
        
        let userRole = request.role
      
        if (userRole== 'Admin'){
            let lst = evLst.getBETEvents(request.query.sport).concat( evLst.getNODDEvents(request.query.sport));
            response.status(200).send(
                {
                    "EventList": lst,
                    "Leagues": evLst.getLeagues(request.query.sport)
                });
        }
        else if (userRole == 'apostador') {
            response.status(200).send(
                {
                    "EventList": evLst.getBETEvents(request.query.sport),
                    "Leagues": evLst.getLeagues(request.query.sport),
                    "Followed": evLst.getGamesFollowed(request.query.sport,request.email)
                });
        }
        else if (userRole == 'Special' ){// Especialista
            response.status(200).send(
                {
                    "EventList": evLst.getNODDEvents(request.query.sport),
                    "Leagues": evLst.getLeagues(request.query.sport)
                });
        }
        else  response.status(404).send("Not found");
        
    }

    /**
     * Handler for the request to add odds to a event (needs to be a specialist)
     */
    addEventOdds(request:any,response:any){
        
        let flag = evLst.changeEventOdd(request.body.sport,request.body.EventoId,request.body.Odds);
        if (flag) response.status(200).send("Odds for event " + request.body.EventoId+ "were added");
        else response.status(404).send("Event not found");
    }


    /**
     * Start-up of the event list
     */
    initEventLst(){
        dbComms.getEventsOnDb().then((result:any)=>{
            for (let event of result){
                evLst.addEventFromDB(event.Desporto,event.Liga,event.ID,event.Descricao,event.Resultado,event.Estado,event.DataEvent);
            }
            apiComms.fetchEvents();
        }).catch((e:any)=>{
            console.log(e)
        })
    }


    /**
     * Function that deals with a http request to updateEvents
     */
    updateEvents(){
        let availableSports = evLst.getAvailableSports();
        for (let sport of availableSports){
            dbComms.startedEventOnDb(sport).then((result:any)=>{
                  
                apiComms.updateEvents(sport,result).then(async()=>{
                    for (let eventID of result){
                        let event = evLst.getEventDB(sport,eventID);
                        if (event["Estado"]  == "FIN")
                        await dbComms.finEventOnDb(eventID,sport,event["Resultado"],event["Descricao"]).then((message:any)=>{
                            for (let triple of message.toNotify) {
                                const notification = MsgGen.generateMessage(triple[1], triple[2]);
                                notificationHandler.addBetNotification([triple[0]], notification);
                                dbComms.walletOnDb(triple[0]).then((info) => { notificationHandler.addWalletNotification(triple[0], info)
                    
        })}})}})})}}



    /**
     * Method that updates events periodically
     */
    async periodicUpdate(time:number){
        if (time > 0){
            setTimeout(() => {
                console.log('Update Time!');
                this.updateEvents()
                this.periodicUpdate(time);
            }, time*1000);
        }
    }



    /**
     * Method responsible for activating super odds in a event
     */
    activateSuperOdds(request:any,response:any){
        let flag = evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
        if (flag) {

            let followers = evLst.getGameFollowers(request.body.sport,request.body.EventoID)
            const notification = MsgGen.generateMessage([request.body.sport,request.body.EventoID],MsgGen.SUPPER_ODDS_MESSAGE)
        
            notificationHandler.addBetNotification(followers,notification)
            
            response.status(200).send("Super odds for event "+request.body.EventoID+ " added");
        }
        else response.status(404).send("Event not found");
    }

    /**
     * Method responsible for updating the odds of a certain event
     */
    getOdds(request:any,response:any){
        response.status(200).send(evLst.getOdds(request.body.sport,request.body.EventoID))
    }

    /**
     * Function that deals with a http request to add a follower to a game
     */
    addGameFollower(request:any,response:any){
        let userEmail = request.email
        let sport = request.body.sport;
        let id = request.body.id;
        let flag= evLst.addGameFollower(sport,id,userEmail);
        if (flag) response.status(200).send("Follow adicionado");
        else response.status(200).send("Follow Não adicionado");
    }

    /**
     * Function that deals with a http request to remove a follower from a game
     */
    removeGameFollower(request:any,response:any):void{
        let userEmail = request.email
        let sport = request.body.sport;
        let id = request.body.id;
        let flag = evLst.removeGameFollower(sport,id,userEmail);
        if (flag) response.status(200).send("Follow removido");
        else response.status(200).send("Follow Não removido");
    }

    /**
     * Handler responsible for establishing the SSE
     */
    eventHandler(request:any,response:any,next:any){
        
        let userEmail = request.email
       
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Connection', 'keep-alive');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('X-Accel-Buffering', 'no');
        response.setHeader('Access-Control-Allow-Origin', "*");
        
        notificationHandler.addGate(userEmail,response);
        dbComms.walletOnDb(userEmail).then((info:any)=>{notificationHandler.addWalletNotification(userEmail,info);});
        
    }

}