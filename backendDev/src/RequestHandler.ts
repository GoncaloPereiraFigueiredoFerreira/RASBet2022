import {EventList} from "./Models/EventList";
import {DBCommunication} from "./DBCommunication/DBCommunication";
import {NotificationHandler} from "./SessionControl/NotificationHandler";
import { AuthenticationHandler } from "./SessionControl/Security";
const evLst:IControlEvents = EventList.getInstance()
const apiComms = require("./APICommunication/APICommunication");
const dbComms = new DBCommunication();
const notificationHandler:INotificationHandler = NotificationHandler.getInstance();
const authHandler = new AuthenticationHandler();
const bcrypt = require('bcrypt')

require("dotenv").config();


import {Apostador,Transacao,Promocao,Aposta,Evento} from './DBCommunication/DBclasses';

export class RequestHandler implements IRequestHandler{
    constructor(){
        this.updateEvents = this.updateEvents.bind(this);
        this.updateResults = this.updateResults.bind(this);
        
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
            const refreshToken = authHandler.generateRefreshToken(userInfo)
            //response.status(200).send({"AccessToken":token,"RefreshToken":refreshToken})
            response.status(200).send({"Token":token,"RefreshToken":refreshToken})
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
            message['RefreshToken'] = authHandler.generateRefreshToken(userInfo)
            response.status(200).send(message)

        }).catch((message:any)=>{
            response.status(400).send(message)
        })

    }

    logoutFunction(request:any,response:any){
        //TODO - mudar para header
        authHandler.delete(request.body.token)
        response.sendStatus(200)
    }

    refreshTokenFunction(request:any,response:any){
        //const accessToken = authHandler.refreshAccessToken(request.headers.refreshtoken)
        const accessToken = authHandler.refreshAccessToken(request.body.refreshtoken)
        if(accessToken==null) response.sendStatus(400)
        else response.status(200).send({'AccessToken':accessToken})
    }


    /**
     * Function that deals with a http request to register a bet
     */
    registerBetFunction(request:any,response:any){

        let list:Evento[]=[]
        let aposta = new Aposta(request.body.Aposta)
        let Eventos = request.body.Eventos
        let userEmail = request.email

        for(let i = 0 ; i< Eventos.length; i++){
            list.push(new Evento(evLst.getEventDB(Eventos[i].Desporto,Eventos[i].EventoID)))
        }
            
        aposta.ApostadorID= userEmail
        
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
            
            for(let tuple of message.toNotify){
                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                //Send email and notification
                notificationHandler.addBetNotification(tuple[0],tuple[1]);
                
                // Notify wallet
                await dbComms.walletOnDb(tuple[0]).then((info:number)=>{
                
                    notificationHandler.addWalletNotification(tuple[0],info);
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
        console.log(`ProfileInfoFunction: ${userEmail}`)
        
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
                    "Leagues": evLst.getLeagues(request.query.sport)
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
            apiComms.initEventLst();
        }).catch((e:any)=>{
            console.log(e)
        })
    }


    /**
     * Handler responsible for updating all the results of football events
     */
    updateFUTEvents(){
       
        return new Promise<void>((resolve,reject)=>{
        dbComms.startedEventOnDb("FUT").then((result:any)=>{
          
            apiComms.updateFutResults(result).then(async()=>{
                for (let fixture of result){
                    let event = evLst.getEventDB("FUT",fixture);
                    if (event["Estado"] == "FIN"){
                        await dbComms.finEventOnDb(fixture,"FUT",event["Resultado"],event["Descricao"]).then((message:any)=>{
                            for(let tuple of message.toNotify){
                                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                                notificationHandler.addBetNotification(tuple[0],tuple[1]);
                               
                                dbComms.walletOnDb(tuple[0]).then((info:any)=>{notificationHandler.addBetNotification(tuple[0],info);});
                    
                            }
                        });
                    }
                }
                resolve();
            });
        });
    });
    }


    /**
     * Handler responsible for updating all the results of F1 events
     */
    updateF1Events(){ 
        return new Promise<void>((resolve,reject)=>{
        dbComms.startedEventOnDb("F1").then((result:any)=>{

            apiComms.updateF1Results(result).then(async()=>{
                for (let race of result){
                    let event = evLst.getEventDB("F1",race);
                    if (event["Estado"]  == "FIN")
                        await dbComms.finEventOnDb(race,"F1",event["Resultado"],event["Descricao"]).then((message:any)=>{
                            for(let tuple of message.toNotify){
                                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                                notificationHandler.addBetNotification(tuple[0],tuple[1]);
                               
                                dbComms.walletOnDb(tuple[0]).then((info:any)=>{notificationHandler.addWalletNotification(tuple[0],info);});
                            }
                        });
                        
                }
                resolve();
            });
                

        });
    });
    }


    /**
     * Handler responsible for updating all the results of basketball events
     */
    updateBSKEvents(){
        return new Promise<void>((resolve,reject)=>{
        dbComms.startedEventOnDb("BSK").then((result:any)=>{
            apiComms.updateBSKResults(result).then(async()=>{
                for (let game of result){
                    let event = evLst.getEventDB("BSK",game);
                    if (event["Estado"] == "FIN"){
                        await dbComms.finEventOnDb(game,"BSK",event["Resultado"],event["Descricao"]).then((message:any)=>{
                            for(let tuple of message.toNotify){
                                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                                notificationHandler.addBetNotification(tuple[0],tuple[1]);
                              
                                dbComms.walletOnDb(tuple[0]).then((info:any)=>{notificationHandler.addWalletNotification(tuple[0],info);});
                            }
                        });
                        
                    }
                }
                resolve();
            });
        })
    });
    }

    /**
     * Handler responsible for updating all the results of portuguese football events
     */
    updateFUTPTEvents(){
       
        return new Promise<void>((resolve,reject)=>{
            dbComms.startedEventOnDb("FUTPT").then((result:any)=>{
                apiComms.updateFUTPTResults(result).then(async()=>{
                for (let game of result){
                    let event= evLst.getEventDB("FUTPT",game);
                    if (event["Estado"] == "FIN"){
                        await dbComms.finEventOnDb(game,"FUTPT",event["Resultado"],event["Descricao"]).then((message:any)=>{
                            for(let tuple of message.toNotify){
                                console.log(`Email ${tuple[0]} e mensagem ${tuple[1]}`)
                                notificationHandler.addBetNotification(tuple[0],tuple[1]);
                                
                                dbComms.walletOnDb(tuple[0]).then((info:any)=>{notificationHandler.addWalletNotification(tuple[0],info);});
                            }
                        });
                        
                    } 
                }
                resolve();
            })
        })
        })

    }

    /**
     * 
     * Method responsible for updating the results of events
     */
    updateResults(){
        return new Promise<void>((resolve,reject)=>{
            this.updateFUTEvents().then(() => evLst.removePastEvents("FUT"))
            this.updateF1Events().then(() =>evLst.removePastEvents("F1"))
            this.updateBSKEvents().then(() =>evLst.removePastEvents("BSK"))
            this.updateFUTPTEvents().then(() =>evLst.removePastEvents("FUTPT"));
            resolve();
        });
    }



    /**
     * Method responsible for updating the events in the backend 
     */

    updateEvents(request:any,response:any){
        
        this.updateResults();
        apiComms.updateEventLst();
        response.sendStatus(200);     
    }

    /**
     * Method responsible for activating super odds in a event
     */
    activateSuperOdds(request:any,response:any){
       
        let flag = evLst.superOdds(request.body.sport,request.body.EventoID,request.body.multiplier);
        if (flag) response.status(200).send("Super odds for event "+request.body.EventoID+ " added");
        else response.status(404).send("Event not found");
    }

    /**
     * Method responsible for updating the odds of a certain event
     */
    getOdds(request:any,response:any){
        response.status(200).send(evLst.getOdds(request.body.sport,request.body.EventoID))
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
        request.on('close', () => {
            console.log('DEU close')
            notificationHandler.closeConnection(userEmail);
        });
        
    }

}