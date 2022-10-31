const mysql= require('mysql')
const fs = require('fs')

class DBCommunication {


//É PRECISO VER A PARTE DOS THROW ERR

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

    

    registerOnDb(apostador,callback){
        let sql= 'INSERT INTO Apostador SET ?,`Balance`= 0'
        this.db.query(sql,apostador,(err,result)=>{
            try{
                if(err) throw err;
                return callback({"Res":"Sim"})
            }
            catch(err){
                return callback({"error":err.code})
            }
        })
    }

    transactionOnDb(transacao,callback){
    
        if(transacao.Tipo=="Aposta_Ganha" || transacao.Tipo=="Deposito_Conta"){
            console.log("a transacao é a AG ou DC")
            let sql='UPDATE Apostador SET Balance= Balance + ? WHERE Email= ? '
            this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
                try{

                    if(err) throw err;
                    console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
                    sql= 'INSERT INTO Transacao SET ?'
                    this.db.query(sql,transacao,(err,result)=>{
                        try{
                            if(err) throw err;
                            console.log("Transacao efetuada")
                            return callback("Transacao efetuada")
                        }
                        catch(err){
                            return callback({"error":err.code})
                        }
                        
                    })
                }
                catch(err){
                    return callback({"error":err.code})
                }
                
            })
        }
        else{
            console.log("a transacao é AP ou LC")
            let sql='SELECT Balance From Apostador Where Email= ? '
            this.db.query(sql,transacao.ApostadorID,(err,result)=>{
                try{
                    if(err) throw err;
                    console.log(result)
                    
                    console.log(`balance-> ${result[0].Balance}`)

                    console.log(`transacao.valor -> ${transacao.Valor}`)

                    if(result[0].Balance<transacao.Valor){

                        return callback({"error":"Not enough balance"})
                    }
                    else{
                        sql='UPDATE Apostador SET Balance= Balance - ? WHERE Email= ? '
                        this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
                            try{

                                if(err) throw err;
                                console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
                                sql= 'INSERT INTO Transacao SET ?'
                                this.db.query(sql,transacao,(err,result)=>{
                                    try{
                                        if(err) throw err;
                                        console.log("Transacao efetuada")
                                        return callback("Transacao efetuada")
                                    }
                                    catch(err){
                                        return callback({"error":err.code})
                                    }
                                    
                                })

                            }
                            catch(err){
                                return callback({"error":err.code})
                            }
                            
                        })
                    }
                }
                catch(err){
                    return callback({"error":err.code})
                }
                
            })
        }
    }
    
    
    
    
    
    loginOnDb(email,pass,callback){
    
        //verifica se há o email na tabela funcionario e caso nao haja vai aos apostadores
        
        let sql= 'SELECT * FROM Funcionario where Email=? AND PlvPasse=? '
        this.db.query(sql,[email,pass],(err,result)=>{
            try{
                if(err) throw err;
                if(!result[0]){
                    sql= 'SELECT * FROM Apostador where Email=? AND PlvPasse=? '
                    this.db.query(sql,[email,pass],(err,result)=>{
                        try{
                            if(err) throw err;
                            if(!result[0]){
                                return callback({error:"Não existem essas credenciais na base de dados"})
                            }
                            else{
                                return callback({"FRole":"apostador"})
                            }
                        }
                        catch(err){
                            return callback({"error":err.code})
                        }
                    }) 
                }
                else{
                    let data = JSON.parse(JSON.stringify(result))
                    return callback({'FRole':data[0].FRole})
                }
            }
            catch(err){
                return callback({"error":err.code})
            }
        })
    }

    // addcodeUsedOnDb(promocao_apostador,callback){
    //     let sql='INSERT INTO Promocao_Apostador SET ?'
    //     this.db.query(sql,promocao_apostador,(err,result)=>{
    //         try{
    //             if(err) throw err;
    //             return callback("Codigo usado guardado")
    //         }
    //         catch(err){
    //             return callback(err.code)
    //         }
            
    //     })
    // }
    registerBetOnDb(aposta,eventos,codigo,callback){
        let db= this.db
        let eventosquery=""
        //nao verifica se se pode usar codigo promocional
        
        //regista a transação de aposta
        this.transactionOnDb({"ApostadorID":aposta.ApostadorID,"Valor":aposta.Montante,"Tipo":"Aposta","DataTr":aposta.DateAp},function(result){
            if(result.error) return callback(result)

            //caso nao tenha usado um codigo promocional

            if(codigo==null){

                let sql= 'INSERT INTO Aposta SET ?'
                db.query(sql,aposta,(err,result)=>{
                    try{
                        if(err) throw err
                        //devolve o último id inserido por auto_increment
                        sql= 'SELECT LAST_INSERT_ID() as LastID'
                        db.query(sql,(err,result)=>{
                            try{
                                if(err) throw err;
                                var data=JSON.parse(JSON.stringify(result))
                                for(let i =0; i<eventos.length;i++){
                                    eventosquery+=`(${data[0].LastID},'${eventos[i].EventoID}','${eventos[i].Desporto}')`
                                    if(i<eventos.length-1){eventosquery+=','}
                                }
                                sql= 'INSERT INTO Aposta_Evento VALUES '+eventosquery
                                db.query(sql,(err,result)=>{
                                    try{
                                        if(err) throw err;
                                        return callback({'Res':'Aposta adicionada'})

                                    }
                                    catch(err){
                                        console.log(err)
                                        return callback({"error":err.code})
                                    }
                                }) 

                            }
                            catch(err){
                                console.log(err)
                                return callback({"error":err.code})
                            }
                        })
                    }
                    catch(err){
                        return callback({"error":err.code})
                    }
                })
            }
            else{
                //regista a utilização da promoção por parte do apostador

                let sql= 'INSERT INTO Promocao_Apostador SET ?'
                db.query(sql,{"Codigo":codigo,"ApostadorID":aposta.ApostadorID},(err,result)=>{
                    try{
                        if(err) throw err

                        //procura o valor do codigo aplicado para depois somar ao montante da aposta
                            
                        sql='SELECT Valor FROM Promocao WHERE Codigo = ?'
                        db.query(sql,codigo,(err,result)=>{
                            try{
                                if(err) throw err
                                let data = JSON.parse(JSON.stringify(result))
                                aposta.Montante+= data[0].Valor

                                //regista a aposta

                                sql= 'INSERT INTO Aposta SET ?'
                                db.query(sql,aposta,(err,result)=>{
                                    try{
                                        if(err) throw err;

                                        //devolve o último id inserido por auto_increment

                                        sql= 'SELECT LAST_INSERT_ID() as LastID'
                                        db.query(sql,(err,result)=>{
                                            try{
                                                if(err) throw err;
                                                var data=JSON.parse(JSON.stringify(result))
                                                //console.log(data[0])
                                                //console.log(data[0].LastID)

                                                //regista na table aposta_evento 

                                                for(let i =0; i<eventos.length;i++){
                                                    eventosquery+=`(${data[0].LastID},'${eventos[i].EventoID}','${eventos[i].Desporto}')`
                                                    if(i<eventos.length-1){eventosquery+=','}
                                                }
                                                sql= 'INSERT INTO Aposta_Evento VALUES '+eventosquery
                                                db.query(sql,(err,result)=>{
                                                    try{
                                                        if(err) throw err;
                                                        return callback({'Res':'Aposta adicionada'})
                
                                                    }
                                                    catch(err){
                                                        console.log(err)
                                                        return callback({"error":err.code})
                                                    }
                                                }) 
                                            }
                                            catch(err){
                                                console.log(err)
                                                return callback({"error":err.code})
                                            }
                                        })
                                    }
                                    catch(err){
                                        return callback({"error":err.code})
                                    }
                                })
                            }
                            catch(err){
                                return callback({"error":err.code})
                            }
                        })
                    }
                    catch(err){
                        return callback({"error":err.code})
                    }
                })

            }
        })
    }

    
    
    editProfileOnDb(list,email,callback){
        let sql =`UPDATE Apostador SET ${list} Where Email=?`
        this.db.query(sql,email,(err,result)=>{
            try{
                if(err) throw err;
                return callback({"Res":"Sim"})
            }
            catch(err){
                return callback({"error":err.code})
            }
            
        })
    }
    
    closeEventOnDb(eventID,desporto,callback){
        let sql='UPDATE Evento SET Estado= "CLS" WHERE ID = ? AND Desporto= ?'
        this.db.query(sql,[eventID,desporto],(err,result)=>{
            try{
                if(err) throw err;
                return callback("Evento Fechado")
            }
            catch(err){
                return callback({"error":err.code})
            }
            
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
    
    registerEventOnDb(evento,callback){
        let sql= 'INSERT INTO Evento SET ?'
        this.db.query(sql,evento,(err,result)=>{
            try{
                if(err) throw err;
                return callback("Evento adicionado")
            }
            catch(err){
                
                return callback({"error":err.code})
            }
        })
    }
    
    addPromocaoOnDb(promocao,callback){
        let sql= 'INSERT INTO Promocao SET ?'
        this.db.query(sql,promocao,(err,result)=>{
            try{
                if(err) throw err;
                return callback({"Res":"Sim"})
            }
            catch{
                return callback({"error":err.code})
            }
            
        })
    }
    
    
    
    usedCodOnDb(email,codigo,callback){
        let sql ='SELECT * FROM Promocao WHERE Codigo=?'
        this.db.query(sql,codigo,(err,result)=>{
            try{
                if(!result[0]) return callback({"Res":"Codigo nao existe"})
                sql='SELECT * FROM Promocao_Apostador WHERE Codigo=? AND ApostadorID = ?'
                this.db.query(sql,[codigo,email],(err,result)=>{
                    try{
                        if(err) throw err;
                        if(!result[0]){
                            return callback({"Res":"Nao"})
                        }
                        else{
                            return callback({"Res":"Sim"})
                        }
                    }
                    catch(err){
                        return callback({"error":err.code})
                    }
                })
            }
            catch(err){
                return callback({"error":err.code})
            }
        })
    }
    
    profileInfoOnDb(email,callback){
        let sql='SELECT * FROM Apostador where Email=?'
        this.db.query(sql,email,(err,result)=>{
            try{
                if(err) throw err;
                return callback(result)
            }
            catch(err){
                return callback({"error":err.code})
            }
            
        })
    }
    
    betHistoryOnDb(email,callback){
        let sql='SELECT * FROM Aposta where ApostadorID=?'
        this.db.query(sql,email,(err,result)=>{
            try{
                if(err) throw err;
                return callback(result)
            }
            catch(err){
                return callback({"error":err.code})
            }
            
        })
    }

    //ordenar cronologicamente
    transHistOnDb(email,callback){
        let sql='SELECT * FROM Transacao WHERE ApostadorID=? ORDER BY DataTr DESC'
        this.db.query(sql,email,(err,result)=>{
            try{
                if(err) throw err;
                return callback(result)
            }
            catch(err){
                return callback({"error":err.code})
            }
        })
    }

    walletOnDb(email,callback){
        let sql='SELECT Balance FROM Apostador WHERE Email=?'
        this.db.query(sql,email,(err,result)=>{
            try{
                if(err) throw err
                var data=JSON.parse(JSON.stringify(result))
                
                return callback(data[0].Balance)
            }
            catch(err){
                return callback({'error':err.code})
            }
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