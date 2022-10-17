const mysql= require('mysql')


//É PRECISO VER A PARTE DOS THROW ERR

// Create connection
const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"ola123",
    database:"rasbet"
});


// Connect to database
db.connect((err)=>{
    if(err){
        throw err
    }
    console.log('MySql Connected...')
})



//nao esta bem é preciso mudar
function transactionOnDb(transacao,callback){
    
    if(transacao.Tipo=="AG" || transacao.Tipo=="DC"){
        console.log("a transacao é a AG ou DC")
        let sql='UPDATE Apostador SET Balance= Balance + ? WHERE Email= ? '
        db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
            if(err) throw err;
            console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
            sql= 'INSERT INTO Transacao SET ?'
            db.query(sql,transacao,(err,result)=>{
                if(err) throw err;
                console.log("Transacao efetuada")
                return callback("Transacao efetuada")
            })
        })
    }
    else{
        console.log("a transacao é AP ou LC")
        let sql='SELECT Balance From Apostador Where Email= ? '
        db.query(sql,transacao.ApostadorID,(err,result)=>{
            if(err) throw err;
            console.log(result)
            if(result[0].Balance<transacao.Valor){
                return callback("Not enough balance")
            }
            else{
                sql='UPDATE Apostador SET Balance= Balance - ? WHERE Email= ? '
                db.query(sql,[transacao.Valor,transacao.ApostadorID],(err,result)=>{
                    if(err) throw err;
                    console.log(`Balanco da conta Email= ${transacao.ApostadorID} atualizado`)
                    sql= 'INSERT INTO Transacao SET ?'
                    db.query(sql,transacao,(err,result)=>{
                        if(err) throw err;
                        console.log("Transacao efetuada")
                        return callback("Transacao efetuada")
                    })
                })
            }
        })
    }
}

function registerOnDb(apostador){
    let sql= 'INSERT INTO Apostador SET ?'
    let query= db.query(sql,apostador,(err,result)=>{
        if(err) throw err;
        console.log("Apostador adicionado")
    })
}

function registerBetOnDb(aposta,aposta_evento){
    let sql= 'INSERT INTO Aposta SET ?;INSERT INTO Aposta_Evento SET ?'
    let query= db.query(sql,[aposta,aposta_evento],(err,result)=>{
        if(err) throw err;
        console.log("Aposta_Evento adicionada")
    })
}


function loginOnDb(email,pass,callback){

    //verifica se há o email na tabela funcionario e caso nao haja vai aos apostadores
    
    let sql= 'SELECT * FROM Funcionario where Email=? AND PlvPasse=? '
    let query= db.query(sql,[email,pass],(err,result)=>{
        if(err) throw err;
        console.log(result)
        if(!result[0]){
            console.log("era vazio")
            sql= 'SELECT * FROM Apostador where Email=? AND PlvPasse=? '
            query= db.query(sql,[email,pass],(err,result)=>{
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

function editProfileOnDb(list,email,callback){
    let sql =`UPDATE Apostador SET ${list} Where Email=?`
    db.query(sql,email,(err,result)=>{
        if(err) throw err;
        return callback("Perfil editado")
    })
}

function closeEventOnDb(eventID){
    let sql='UPDATE Evento SET Estado= "FN" WHERE ID = ?'
    db.query(sql,eventID,(err,result)=>{
        if(err) throw err;
        console.log("Evento Fechado")
    })
}

function suspndEventOnDb(eventID){
    let sql='UPDATE Evento SET Estado= "SO" WHERE ID = ?'
    db.query(sql,eventID,(err,result)=>{
        if(err) throw err;
        console.log("Evento suspenso")
    })
}

function registerEventOnDb(evento){
    let sql= 'INSERT INTO Evento SET ?'
    let query= db.query(sql,evento,(err,result)=>{
        if(err) throw err;
        console.log("Evento adicionado")
    })
}

function addPromocaoOnDb(promocao){
    let sql= 'INSERT INTO Promocao SET ?'
    db.query(sql,promocao,(err,result)=>{
        if(err) throw err;
        console.log("Promocao adicionada")
    })
}

function addcodeUsedOnDb(promocao_apostador){
    let sql='INSERT INTO Promocao_Apostador SET ?'
    db.query(sql,promocao_apostador,(err,result)=>{
        if(err) throw err;
        console.log("Codigo usado guardado")
    })
}

function usedCodOnDb(email,codigo,callback){
    let sql='SELECT * FROM Promocao_Apostador WHERE Codigo=? AND ApostadorID = ?'
    db.query(sql,[codigo,email],(err,result)=>{
        if(err) throw err;
        if(!result[0]){
            return callback(`O CLiente ${email} ainda nao usou o codigo promocional ${codigo}`)
        }
        else{
            return callback(`O CLiente ${email} ja usou o codigo promocional ${codigo}`)
        }
    })

}

function profileInfoOnDb(email,callback){
    let sql='SELECT * FROM Apostador where Email=?'
    let query= db.query(sql,email,(err,result)=>{
        if(err) throw err;
        return callback(result)
    })
}

function betHistoryOnDb(email,callback){
    let sql='SELECT * FROM Aposta where ApostadorID=?'
    let query= db.query(sql,email,(err,result)=>{
        if(err) throw err;
        return callback(result)
    })
}


//ordenar cronologicamente
function transHistOnDb(email,callback){
    let sql='SELECT * FROM Transacao WHERE ApostadorID=? ORDER BY DataTr DESC'
    let query= db.query(sql,email,(err,result)=>{
        if(err) throw err;
        return callback(result)
    })
}

module.exports = {
    transactionOnDb,
    registerOnDb,
    registerBetOnDb,
    loginOnDb,
    editProfileOnDb,
    closeEventOnDb,
    suspndEventOnDb,
    registerEventOnDb,
    addPromocaoOnDb,
    addcodeUsedOnDb,
    usedCodOnDb,
    profileInfoOnDb,
    betHistoryOnDb,
    transHistOnDb

    //initEventLst
}