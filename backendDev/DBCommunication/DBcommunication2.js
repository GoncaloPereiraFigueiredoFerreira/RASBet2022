const mysql= require('mysql')
const fs = require('fs');
const EventList = require('../Models/EventList');

class DBCommunication {

    constructor(){
       
        this.db = mysql.createConnection({
            host:"localhost",
            user:"",
            password:""
        });

        this.db.connect((err)=>{
            if(err){
                throw err
            }
            console.log('MySql Connected...')
        })
        this.initDB("DBCommunication/bd.sql")    
        
        
    }

    initDB(filename){
        let sqlCode = fs.readFileSync(filename).toString();
        let processedSql = sqlCode.replace(/\n/gm," ").replace(/\t/gm," ").split(";").slice(0,-1).map(x=> x +=";");
        processedSql.map(x => this.db.query(x,(err, res) => {
            if(err) {
                console.log("Error! " + err.message) ; 
             }
            else {console.log("Init database sql query done!") ; } 
        }));
            
    };

    registerOnDb(apostador){
        return new Promise((resolve,reject)=>{
            let sql= 'INSERT INTO Apostador SET ?,`Balance`= 0'
            this.db.query(sql,apostador,(err,result)=>{
                if(err) {
                    reject({"error":err.code})
                } else {
                    resolve({"Res":"Sim"})
                }
            })
        })
    }



    insert_into_transacao(transacao){
        return new Promise((resolve,reject)=>{
            let sql= 'INSERT INTO Transacao SET ?'
            this.db.query(sql,transacao,(err,result)=>{
                if(err){ 
                    reject({"error":err.code});}
                else{
                    resolve("Transacao efetuada") 
                } 
            })
        })
    }



    transactionOnDb(transacao){
        return new Promise((resolve,reject)=>{
            if(transacao.Tipo=="Aposta_Ganha" || transacao.Tipo=="Deposito_Conta"||  transacao.Tipo=="Refund"){
                let sql='UPDATE Apostador SET Balance= Balance + ? WHERE Email= ? '
                this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
                    if(err){
                        reject({"error":err.code})
                    }
                    else{
                        this.insert_into_transacao(transacao).then((message)=>{
                            resolve(message)
                        }).catch((message)=>{
                            reject(message)
                        })
                    }
                })
            }
            else{
                let sql='SELECT Balance From Apostador Where Email= ? '

                this.db.query(sql,transacao.ApostadorID,(err,result)=>{

                    if(err){

                        reject({'error':err})
                    }
                    else{
                        if(result[0].Balance<transacao.Valor){
                            reject({"error":"Not enough balance"})
                        }
                        else{
                            
                            sql='UPDATE Apostador SET Balance= Balance - ? WHERE Email= ? '
                            
                            this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{ 
                                if(err){reject({'error':err})}
                                else{
                                    this.insert_into_transacao(transacao).then((message)=>{
                                        resolve(message)
                                    }).catch((message)=>{
                                        reject(message)
                                    })
                                }  
                            })
                        }
                    }
                })
            }
        })
    }
    
    loginOnDb(email,pass){
        return new Promise((resolve,reject)=>{
            //verifica se há o email na tabela funcionario e caso nao haja vai aos apostadores

            let sql= 'SELECT * FROM Funcionario where Email=? AND PlvPasse=? '
            this.db.query(sql,[email,pass],(err,result)=>{

                if(err) reject({"error":err.code})
                
                else if(!result[0]){ // devia ser length
                    sql= 'SELECT * FROM Apostador where Email=? AND PlvPasse=? '
                    this.db.query(sql,[email,pass],(err,result)=>{
                            if(err) reject({"error":err.code});
                            else if(!result[0]){
                                reject({error:"Não existem essas credenciais na base de dados"})
                            }
                            else{
                                resolve({"FRole":"apostador"})
                            }
                    }) 
                }
                else{
                    let data = JSON.parse(JSON.stringify(result))
                    resolve({'FRole':data[0].FRole})
                } 
            })
        })
    }

    insert_aposta(aposta,eventos){
        return new Promise((resolve,reject)=>{
            let eventosquery=""
            let sql= 'INSERT INTO Aposta SET ?'
            this.db.query(sql,aposta,(err,result)=>{
                
                if(err) reject({"error":err.code})
                //devolve o último id inserido por auto_increment
                sql= 'SELECT LAST_INSERT_ID() as LastID'
                this.db.query(sql,(err,result)=>{
                    
                    if(err) reject({"error":err.code})
                    var data=JSON.parse(JSON.stringify(result))
                    for(let i =0; i<eventos.length;i++){
                        eventosquery+=`(${data[0].LastID},'${eventos[i].EventoID}','${eventos[i].Desporto}',${eventos[i].Escolha})`
                        if(i<eventos.length-1){eventosquery+=','}
                    }
                    sql= 'INSERT INTO Aposta_Evento VALUES '+eventosquery
                    this.db.query(sql,(err,result)=>{
                        
                            if(err) reject({"error":err.code})
                            resolve({'Res':'Aposta adicionada'})   
                    }) 
                })
            })
        })
    }

    async eventexistsOnDB(desporto,eventID){
        return new Promise((resolve,reject)=>{
            
            let sql='SELECT * FROM Evento WHERE Desporto=? AND ID=?'
            this.db.query(sql,[desporto,eventID],(err,result)=>{
                if(err) {
                    reject({'error':err.code});
                    return 
                }
                if(result[0]==null){
                    resolve('no')
                }
                else{
                    resolve('yes')
                }
            })
        })
    }

    registerEventOnDb(eventos){
        return new Promise(async (resolve,reject)=>{
            
            for(let i =0; i<eventos.length;i++){
                
                await this.eventexistsOnDB(eventos[i].Desporto,eventos[i].ID).then((message)=>{
                    // se nao esta na base de dados insere
                    if(message=='no'){
                        
                        let today = `'${eventos[i].DataEvent.slice(0,10)} ${eventos[i].DataEvent.slice(11,19)}'`
                        let eventosquery=`('${eventos[i].ID}','${eventos[i].Desporto}',${eventos[i].Resultado},'${eventos[i].Descricao}','BET','${eventos[i].Liga}',${today})`
                        
                        let sql= 'INSERT INTO Evento VALUES'+eventosquery
                        this.db.query(sql,(err,result)=>{
                            if(err) {
                                throw({'error':err.code});}
                        })
                    }
                }).then(()=>{
                    resolve({'res':"Evento adicionado"})
                }).catch((message)=>{
                    reject(message)
                    return
                })
                
            } 
        })
    }

    is_closed_finalized(eventos){
        return new Promise((resolve,reject)=>{
            let eventsquery="("
            for(let i =0;i<eventos.length;i++){
                eventsquery+=`(ID= '${eventos[i].EventoID}' AND Desporto='${eventos[i].Desporto}')`
                if(i<eventos.length-1) eventsquery+="OR"
            }
            eventsquery+=")"
            
            let sql='SELECT * FROM Evento WHERE (Estado="CLS" OR Estado="FIN") AND '+eventsquery
            this.db.query(sql,(err,result)=>{
                if(err){
                    reject({'error':err.code})
                    return
                }
                else if(result[0]!=null){
                    reject({'error':'eventos invalidos'})
                    return
                }
                else{
                    resolve("valido")
                }
            })
        })
    }

    getDescricaoLiga(eventoid){
        return new Promise((resolve,reject)=>{
            let sql = "SELECT Descricao,Liga FROM Evento WHERE ID=?"
            this.db.query(sql,eventoid,(err,result)=>{
                if(err){
                    reject({"error":err.code})
                    return
                }
                else{
                    let data = JSON.parse(JSON.stringify(result))
                    console.log('get descricao liga')
                    console.log(data)
                    resolve([data[0].Descricao,data[0].Liga])
                }
            })
        })
    }

    registerBetOnDb(aposta,eventos,codigo){
        
        // nao deixar apostas sobre eventos que estejam finalizados ou closed
        //nao verifica se se pode usar codigo promocional
        return new Promise((resolve,reject)=>{

            //regista a transação de aposta
            
            this.is_closed_finalized(eventos).then((message)=>{
                
                return this.transactionOnDb({"ApostadorID":aposta.ApostadorID,"Valor":aposta.Montante,"Tipo":"Aposta","DataTr":aposta.DateAp})

            }).then((message)=>{
                return new Promise((resolve,reject)=>{
                    if(codigo==null){

                        resolve('done')

                    }
                    else{
                        //regista a utilização da promoção por parte do apostador
    
                        let sql= 'INSERT INTO Promocao_Apostador SET ?'
                        this.db.query(sql,{"Codigo":codigo,"ApostadorID":aposta.ApostadorID},(err,result)=>{
                            
                            if(err) {
                                reject({"error":err.code})
                                return
                            }
                            //procura o valor do codigo aplicado para depois somar ao montante da aposta
            
                            sql='SELECT Valor FROM Promocao WHERE Codigo = ?'
                            this.db.query(sql,codigo,(err,result)=>{
                               
                                if(err) {
                                    reject({"error":err.code})
                                    return
                                }
                                let data = JSON.parse(JSON.stringify(result))
                                aposta.Montante+= data[0].Valor
                                resolve('done')
                                
                            })
                        })
                    }
                })
            }).then( (message)=>{
                return new Promise(async (resolve,reject)=>{
                    let descricao=`${codigo}#`
                    
                    if(eventos.length>1) descricao+="Multipla#"
                    else descricao+="Simples#"
                    for(let i =0 ; i< eventos.length ; i++){

                        await this.getDescricaoLiga(eventos[i].EventoID).then((event)=>{
                            console.log('test 1111')
                            console.log(event)
                            descricao+=`${eventos[i].Desporto}>${event[1]}>${event[0]}`
                            if(i<eventos.length-1) descricao+="#"
                        }).catch((message)=>{
                            reject(message)
                        })
                        
                    }
                    console.log(descricao)
                    
                    aposta.Descricao=descricao
                    resolve('done')
                })
            
            }).then((message)=>{
                return this.insert_aposta(aposta,eventos)
            }).then((message)=>{  
                resolve(message)
            }).catch((message)=>{
                reject(message)
            })
        })
    }

    
    
    editProfileOnDb(list,email){
        return new Promise((resolve,reject)=>{
            let sql =`UPDATE Apostador SET ${list} Where Email=?`
            this.db.query(sql,email,(err,result)=>{
                if(err) reject({"error":err.code});
                resolve({"Res":"Sim"})  
            })
        })
    }
    
    returnMoney(eventID,desporto){
        return new Promise((resolve,reject)=>{

        })
    }

    //devolve lista de apostaID's nos quais foram mudados os estados dos eventos
    setEstadoEvento(estado,eventID,desporto,resultado){
        return new Promise((resolve,reject)=>{
            let sql
            let args
            if(estado=='FIN'){
                sql = 'UPDATE Evento SET Estado= ? , Resultado=? WHERE ID = ? AND Desporto= ?'
                args=[estado,resultado,eventID,desporto]
            }
            else{
                sql='UPDATE Evento SET Estado= ? WHERE ID = ? AND Desporto= ?'
                args=[estado,eventID,desporto]
            }
            this.db.query(sql,args,(err,result)=>{
                if(err) reject({'error':err.code});
                sql='SELECT ApostaID FROM Aposta_Evento WHERE EventoID = ? AND Desporto= ? '
                this.db.query(sql,[eventID,desporto],(err,result)=>{
                    if(err) reject({'error':err.code});
                    if(result[0]!=null){
                        resolve(JSON.parse(JSON.stringify(result)))
                    }
                    else{
                        resolve({'Res':`Evento ${estado}`}) 
                    }
                })   
            })
        })
    }

    delete_apostaID(data,i){
        return new Promise((resolve,reject)=>{
            let sql='DELETE FROM Aposta_Evento Where ApostaID = ?'
            this.db.query(sql,data[i].ApostaID,(err,result)=>{
                if(err) reject({'error':err.code});
                resolve(data)
            })
        })
    }

    closeEventOnDb(eventID,desporto){
        return new Promise((resolve,reject)=>{
            this.setEstadoEvento("CLS",eventID,desporto).then(async (message)=>{
                for(let i = 0 ; i< message.length ;i++){
                    await this.delete_apostaID(message,i).then((data)=>{
                        let sql='UPDATE Aposta SET Estado = "CLS" WHERE ID=?'
                        this.db.query(sql,data[i].ApostaID,(err,result)=>{
                            if(err) throw({'error':err.code});

                            sql='Select Montante,ApostadorID FROM Aposta WHERE ID=?'
                            this.db.query(sql,data[i].ApostaID,(err,result)=>{

                                if(err) throw({'error':err.code});
                                let data2 = JSON.parse(JSON.stringify(result))
                                let today = `${(new Date().toJSON().slice(0,10))} ${(new Date().toJSON().slice(12,19))}`

                                this.transactionOnDb({"ApostadorID":data2[0].ApostadorID,"Valor":(data2[0].Montante),"Tipo":"Refund","DataTr":today}).catch((message)=>{
                                    throw(message)
                                })
                            })
                        })
                    })
                }
            }).then(resolve({'Res':'evento closed'})
            ).catch((message)=>{
                reject(message)
            })
        })
    }

    wonBet(apostaID,i,resultado,desporto,eventID){
        return new Promise((resolve,reject)=>{
            let sql='SELECT Escolha FROM Aposta_Evento WHERE ApostaID=? AND EventoID = ? AND Desporto = ?'
            this.db.query(sql,[apostaID[i].ApostaID,eventID,desporto],(err,result)=>{
                if(err) reject({'error':err.code});
                let data = JSON.parse(JSON.stringify(result))
                if(data[0].Escolha==resultado){
                    resolve(['win',apostaID])
                }
                else{ resolve(['lost',apostaID])}
            })
        })

    }

    finEventOnDb(eventID,desporto,resultado){
        return new Promise((resolve,reject)=>{
            this.setEstadoEvento("FIN",eventID,desporto,resultado).then(async (mes)=>{
                for(let i = 0 ; i< mes.length ;i++){
                    //se ganhou evento vai verificar se há algum evento daquela ApostaID que nao tenha acabado
                    // se nao houver, da lhe o dinheiro
                    //se perdeu evento vai retirar todas as ocurrencia daquela ApostaID no Aposta_Evento
                    await this.wonBet(mes,i,resultado,desporto,eventID).then((message)=>{
                        //message[0] se ganhou
                        // message[1] ids de aposta
                        if(message[0]=='win'){
                            
                            let sql='SELECT EventoID FROM Aposta_Evento INNER JOIN Evento ON Aposta_Evento.Desporto= Evento.Desporto AND Aposta_Evento.EventoID = Evento.ID WHERE Aposta_Evento.ApostaID=? AND Evento.Estado != "FIN"'
                            this.db.query(sql,message[1][i].ApostaID,(err,result)=>{
                                if(err) throw({'error':err.code});

                                //todas estao finalizadas 
                                if(result[0]==null){

                                    sql='UPDATE Aposta SET Estado = "WON" WHERE ID=?'
                                    this.db.query(sql,message[1][i].ApostaID,(err,result)=>{
                                        if(err) throw({'error':err.code});

                                        sql='Select Montante,ApostadorID,Odd FROM Aposta WHERE ID=?'
                                        this.db.query(sql,message[1][i].ApostaID,(err,result)=>{
                                            
                                            if(err) throw({'error':err.code});
        
                                            let data2 = JSON.parse(JSON.stringify(result))
                                            let today = `${(new Date().toJSON().slice(0,10))} ${(new Date().toJSON().slice(12,19))}`
        
                                            this.transactionOnDb({"ApostadorID":data2[0].ApostadorID,"Valor":(data2[0].Montante)*(data2[0].Odd),"Tipo":"Aposta_Ganha","DataTr":today
                                            }).catch((message)=>{
                                                throw(message)
                                            })
                                        })
                                    })  
                                }
                            })  
                        }
                        else{
                           
                            let sql='UPDATE Aposta SET Estado = "LOST" WHERE ID=?'
                            this.db.query(sql,message[1][i].ApostaID,(err,result)=>{
                               
                                if(err) throw({'error':err.code});
                                this.delete_apostaID(message[1],i).catch((message)=>{
                                    throw(message)
                                })
                            })
                            
                        }
                    }).catch((message)=>{
                        throw(message)
                    })
                }
            }).then(()=>{
                resolve({'Res':'Evento finalizado'})
            }).catch((message)=>{
                reject(message)
            })
        })
    }

    
    suspndEventOnDb(eventID,callback){
        let sql='UPDATE Evento SET Estado= "NODD" WHERE ID = ?'
        this.db.query(sql,eventID,(err,result)=>{
            try{
                if(err) throw err;
                return callback("Evento suspenso")
            }
            catch(err){
                return callback({"error":err.code})
            }
        })
    }
    
    
    
    addPromocaoOnDb(promocao){
        return new Promise((resolve,reject)=>{
            let sql= 'INSERT INTO Promocao SET ?'
            this.db.query(sql,promocao,(err,result)=>{  
                if(err) reject({"error":err.code});
                resolve({"Res":"Sim"})   
            })
        })
    }
    
    //nao verifica se ainda existe
    remPromocaoOnDb(codigo){
        return new Promise((resolve,reject)=>{
            let sql= 'DELETE FROM Promocao_Apostador WHERE Codigo=?'
            this.db.query(sql,codigo,(err,result)=>{
                sql= 'DELETE FROM Promocao WHERE Codigo=?'
                this.db.query(sql,codigo,(err,result)=>{  
                    if(err) reject({"error":err.code});
                    resolve({"Res":"Sim"})   
                })
            })
        })
    }

    getpromocaoOnDb(codigo){
        return new Promise((resolve,reject)=>{
            let sql= 'SELECT * FROM Promocao'
            this.db.query(sql,codigo,(err,result)=>{
                
                if(err) {
                    reject({"error":err.code})
                    return
                }
                
                resolve(result)   
               
            })
        })
    }
    
    usedCodOnDb(email,codigo){
        return new Promise((resolve,reject)=>{
            if(codigo==null){
                resolve({"Res":"Codigo promocional nulo"})
                return
            }
            let sql ='SELECT * FROM Promocao WHERE Codigo=?'
            this.db.query(sql,codigo,(err,result)=>{
                
                if(err){ 
                    reject({"error":err.code})
                    return
                }
                if(!result[0]){
                    
                    reject({"error":"Codigo nao existe"})
                    return
                }  

                sql='SELECT * FROM Promocao_Apostador WHERE Codigo=? AND ApostadorID = ?'
                this.db.query(sql,[codigo,email],(err,result)=>{
                    
                    if(err) reject({"error":err.code});
                    if(!result[0]){
                        resolve({"Res":"Nao"})
                         
                    }
                    else{
                        resolve({"Res":"Sim"})
                    }
                })
            })
        })
    }
    
    profileInfoOnDb(email,callback){
        return new Promise((resolve,reject)=>{
            let sql='SELECT * FROM Apostador where Email=?'
            this.db.query(sql,email,(err,result)=>{
                
                if(err) reject({"error":err.code});
                resolve(result[0])     
            })
        }) 
    }
    

    betHistoryOnDb(email,callback){
        return new Promise((resolve,reject)=>{
            let sql='SELECT * FROM Aposta where ApostadorID=?'
            this.db.query(sql,email,(err,result)=>{
                    if(err) reject ({"error":err.code});
                    resolve(result)  
            })
        })
    }

    //ordenar cronologicamente
    transHistOnDb(email,callback){
        return new Promise((resolve,reject)=>{
            let sql='SELECT * FROM Transacao WHERE ApostadorID=? ORDER BY DataTr DESC'
            this.db.query(sql,email,(err,result)=>{
              
                if(err) reject ({"error":err.code});
                resolve(result)
                
            })
        })
        
    }

    startedEventOnDb(desporto){
        let today = `${(new Date().toJSON().slice(0,10))} ${(new Date().toJSON().slice(12,19))}` 
        return new Promise((resolve,reject)=>{
            let sql='SELECT ID FROM Evento WHERE Desporto=? AND DataEvent < ? AND Estado="BET"'
            this.db.query(sql,[desporto,today],(err,result)=>{
                if(err) reject({'error':err.code})
                let data = JSON.parse(JSON.stringify(result))
                let ids=[]
                for(let i =0;i < data.length;i++){
                    ids.push(data[i].ID)
                }
                resolve(ids)
            })
        })
    }

    walletOnDb(email){
        return new Promise((resolve,reject)=>{
            let sql='SELECT Balance FROM Apostador WHERE Email=?'
            this.db.query(sql,email,(err,result)=>{
                    if(err){
                        reject({'error':err.code})
                    }
                    else{
                        if (result.length >0){
                            var data=JSON.parse(JSON.stringify(result))
                            resolve(data[0].Balance)
                        }else resolve(0);
                    }  
            })
        }) 
    }

    getPastFUTEventsOnDb(callback){
        let sql = "SELECT * FROM EVENTO WHERE Estado = BET AND DESPORTO = FUT" // e cuja data é anterior à atual
        this.db.query(sql,(err,result)=>{
            try{
                if(err) throw err;
                return callback(result)
            }
            catch(err){
                return callback({"error":err.code})
            }
        });
    }

    getEventsOnDb(callback){
        let sql = "SELECT * FROM Evento"
        this.db.query(sql,(err,result)=>{
            try{
                if(err) throw err;
                return callback(result)
            }
            catch(err){
                return callback({"error":err.code})
            }
        });
    }
     

}
module.exports = DBCommunication