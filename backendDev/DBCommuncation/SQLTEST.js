// Testing the sql script implementation

// Imports of modules filesystem and mysql
const mysql = require('mysql');
const fs = require('fs');

// Creates a connection to mysql server
const connection = mysql.createConnection({
    host: 'localhost'
});

//Connects to it
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });


sqlScriptExecutor("Test#3/bd.sql",connection);


// Function that executes sql cripts to the 
function sqlScriptExecutor (filename,connection){
    let sqlCode = fs.readFileSync(filename).toString();

    let processedSql = sqlCode.replace(/\n/gm,"").split(";").slice(0,-1).map(x=> x +=";");
    
    processedSql.map(x => connection.query(x,(err, res) => {
        if(err) {
            console.log("Error! " + err.message) ; 
        }
        else {console.log("Done!") ; } 
    }));
    
};



/*
connection.query(sqlCode,(err, res) => {
    if(err) {
        console.log("Error! ") ; 
        console.log(err.message);
    }
    else {console.log("Done!") ; } 
});
*/
