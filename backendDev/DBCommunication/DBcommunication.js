const mysql= require('mysql')
const fs = require('fs')

class DBCommunication {


//É PRECISO VER A PARTE DOS THROW ERR

    constructor(){
       
        this.db = mysql.createConnection({
            host:"localhost"
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
        let processedSql = sqlCode.replace(/\n/gm,"").split(";").slice(0,-1).map(x=> x +=";");
        processedSql.map(x => this.db.query(x,(err, res) => {
            if(err) {
                console.log("Error! " + err.message) ; 
             }
            else {console.log("Done!") ; } 
        }));
            
    };

    //nao esta bem é preciso mudar
    transactionOnDb(transacao,callback){
        
        if(transacao.Tipo=="AG" || transacao.Tipo=="DC"){
            console.log("a transacao é a AG ou DC")
            let sql='UPDATE Apostador SET Balance= Balance + ? WHERE Email= ? '
            this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
            if(err) throw err;
            console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
            sql= 'INSERT INTO Transacao SET ?'
            this.db.query(sql,transacao,(err,result)=>{
                if(err) throw err;
                console.log("Transacao efetuada")
                return callback("Transacao efetuada")
                })
            })
        }
        else{
            console.log("a transacao é AP ou LC")
            let sql='SELECT Balance From Apostador Where Email= ? '
            this.db.query(sql,transacao.ApostadorID,(err,result)=>{
                if(err) throw err;
                console.log(result)
                if(result[0].Balance<transacao.Valor){
                    return callback("Not enough balance")
                }
                else{
                    sql='UPDATE Apostador SET Balance= Balance - ? WHERE Email= ? '
                    this.db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
                        if(err) throw err;
                        console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
                        sql= 'INSERT INTO Transacao SET ?'
                        this.db.query(sql,transacao,(err,result)=>{
                            if(err) throw err;
                            console.log("Transacao efetuada")
                            return callback("Transacao efetuada")
                        })
                    })
                }
            })
        }
    }

    registerOnDb(apostador){
        let sql= 'INSERT INTO Apostador SET ?'
        let query= this.db.query(sql,apostador,(err,result)=>{
            if(err) throw err;
            console.log("Apostador adicionado")
        })
    }

    registerBetOnDb(aposta,aposta_evento){
        let sql= 'INSERT INTO Aposta SET ?;INSERT INTO Aposta_Evento SET ?'
        let query= this.db.query(sql,[aposta,aposta_evento],(err,result)=>{
            if(err) throw err;
            console.log("Aposta_Evento adicionada")
        })
    }


    loginOnDb(email,pass,callback){

        //verifica se há o email na tabela funcionario e caso nao haja vai aos apostadores
        
        let sql= 'SELECT * FROM Funcionario where Email=? AND PlvPasse=? '
        let query= this.db.query(sql,[email,pass],(err,result)=>{
            if(err) throw err;
            console.log(result)
            if(!result[0]){
                console.log("era vazio")
                sql= 'SELECT * FROM Apostador where Email=? AND PlvPasse=? '
                query= this.db.query(sql,[email,pass],(err,result)=>{
                    if(err) throw err;
                    if(!result[0]){
                        return callback("Não existem essas credenciais na base de dados")
                    }
                    else{
                        return callback(result)
                    }
                }) 
            }
            else{
                console.log("nao era vazio")
                return callback(result)
            }
        })
    }

    editProfileOnDb(list,email,callback){
        let sql =`UPDATE Apostador SET ${list} Where Email=?`
        this.db.query(sql,email,(err,result)=>{
            if(err) throw err;
            return callback("Perfil editado")
        })
    }

    closeEventOnDb(eventID){
        let sql='UPDATE Evento SET Estado= "FN" WHERE ID = ?'
        this.db.query(sql,eventID,(err,result)=>{
            if(err) throw err;
            console.log("Evento Fechado")
        })
    }

    suspndEventOnDb(eventID){
        let sql='UPDATE Evento SET Estado= "SO" WHERE ID = ?'
        this.db.query(sql,eventID,(err,result)=>{
            if(err) throw err;
            console.log("Evento suspenso")
        })
    }

    registerEventOnDb(evento){
        let sql= 'INSERT INTO Evento SET ?'
        let query= this.db.query(sql,evento,(err,result)=>{
            if(err) throw err;
            console.log("Evento adicionado")
        })
    }

    addPromocaoOnDb(promocao){
        let sql= 'INSERT INTO Promocao SET ?'
        this.db.query(sql,promocao,(err,result)=>{
            if(err) throw err;
            console.log("Promocao adicionada")
        })
    }

    addcodeUsedOnDb(promocao_apostador){
        let sql='INSERT INTO Promocao_Apostador SET ?'
        this.db.query(sql,promocao_apostador,(err,result)=>{
            if(err) throw err;
            console.log("Codigo usado guardado")
        })
    }

    usedCodOnDb(email,codigo,callback){
        let sql='SELECT * FROM Promocao_Apostador WHERE Codigo=? AND ApostadorID = ?'
        this.db.query(sql,[codigo,email],(err,result)=>{
            if(err) throw err;
            if(!result[0]){
                return callback(`O CLiente ${email} ainda nao usou o codigo promocional ${codigo}`)
            }
            else{
                return callback(`O CLiente ${email} ja usou o codigo promocional ${codigo}`)
            }
        })

    }

    profileInfoOnDb(email,callback){
        let sql='SELECT * FROM Apostador where Email=?'
        let query= this.db.query(sql,email,(err,result)=>{
            if(err) throw err;
            return callback(result)
        })
    }

    betHistoryOnDb(email,callback){
        let sql='SELECT * FROM Aposta where ApostadorID=?'
        let query= this.db.query(sql,email,(err,result)=>{
            if(err) throw err;
            return callback(result)
        })
    }


    //ordenar cronologicamente
    transHistOnDb(email,callback){
        let sql='SELECT * FROM Transacao WHERE ApostadorID=? ORDER BY DataTr DESC'
        let query= this.db.query(sql,email,(err,result)=>{
            if(err) throw err;
            return callback(result)
        })
}

}
module.exports = DBCommunication