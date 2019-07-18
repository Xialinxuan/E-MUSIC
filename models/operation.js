const connect = require('./config')

function insert(param){
    let conn = connect.getConn().conn;
    if(conn){
        conn.prepare("insert into DASH6609.EMOTIONSTATS values(?, ?, ?, ?, ?, ?)", function(err, stmt){
            if(err){
                console.log(err)
            }else{
                stmt.bind(param,function(err){
                    if(err){
                        console.log(err)
                    }else{
                        stmt.execute(function(err){
                            if(err){
                                console.log(err)
                            }else{
                                console.log("insert successfully with id " + param[0]);
                            }
                        });
                    }
                });                    
            }
        });
    }else{
        console.log("connection error in insert");
    }
}

function selectforbuild(callback){
    let conn = connect.getConn().conn;
    if(conn){
        conn.queryResult('SELECT * FROM DASH6609.SONGLIBRARY WHERE "id" >= 522528287', function(err, result){
            if(err){
                console.log(err)
            }else{
                callback(undefined, result);
            }
        });
    }else{
        console.log("connection error in select");
    }
}

module.exports = {
    "insert": insert,
    "selectforbuild": selectforbuild
}