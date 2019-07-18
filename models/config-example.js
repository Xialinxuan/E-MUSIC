const ibm_db = require('ibm_db')
const connString = "DRIVER={DB2};" + "Your dsn"

class db{
    constructor(){
        this.conn = ibm_db.openSync(connString);
    }

    static getConn(){
        if(!db.conn){
            db.conn = new db();
        }
        return db.conn
    }
}

module.exports = db