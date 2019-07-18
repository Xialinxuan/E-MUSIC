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

function selectForBuild(callback){
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

function clean(){
    let conn = connect.getConn().conn;
    if(conn){
        conn.queryResult('SELECT ID, SADNESS, JOY, FEAR, DISGUST, ANGER, COUNT("ID") FROM DASH6609.EMOTIONSTATS GROUP BY "ID", "SADNESS", "JOY", "FEAR", "DISGUST", "ANGER" HAVING COUNT("ID") > 1', function(err, result){
            if(err){
                console.log(err);
            }else{
                let data;
                let paramSet = new Array();
                while(data = result.fetchSync()){
                    //console.log(data);
                    let param = new Array();
                    param.push(data.ID);
                    param.push(data.SADNESS);
                    param.push(data.JOY);
                    param.push(data.FEAR);
                    param.push(data.DISGUST);
                    param.push(data.ANGER);
                    paramSet.push(param);
                }
                for (let index = 0; index < paramSet.length; index++) {
                    const ID = paramSet[index][0];
                    const param = paramSet[index];
                    conn.prepare('DELETE FROM DASH6609.EMOTIONSTATS WHERE "ID" = ?',function(err, stmt){
                        if(err){
                            console.log(err);
                        }else{
                            stmt.bind([ID], function(err){
                                if(err){
                                    console.log(err)
                                }else{
                                    stmt.execute(function(err){
                                        if(err){
                                            console.log(err)
                                        }else{
                                            insert(param);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        })
    }else{
        console.log("connection error in clean");
    }
}

function selectForRecommend(param, callback){
    let conn = connect.getConn().conn;
    if(conn){
        conn.prepare('SELECT ID, (POWER(SADNESS - ? , 2) + POWER(JOY - ? , 2) + POWER(FEAR - ? , 2) + POWER(DISGUST - ? , 2) + POWER(ANGER - ? , 2)) AS DISTANCE FROM DASH6609.EMOTIONSTATS ORDER BY DISTANCE FETCH FIRST 6 ROWS ONLY', function(err, stmt){
            if(err){
                console.log(err);
            }else{
                stmt.bind(param, function(err){
                    if(err){
                        console.log(err)
                    }else{
                        stmt.execute(function(err, result){
                            if(err){
                                console.log(err);
                            }else{
                                let data;
                                let idSet = new Array();
                                while(data = result.fetchSync()){
                                    idSet.push(data.ID);
                                }
                                callback(undefined, idSet);
                            }
                        })
                    }
                })
            }
        })
    }else{
        console.log("connection error in selectForRecommend");
    }
}

module.exports = {
    "insert": insert,
    "selectForBuild": selectForBuild,
    "clean": clean,
    "selectForRecommend": selectForRecommend
}