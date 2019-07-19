const ibm_db = require('ibm_db')
const connString = "DRIVER={DB2};DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash6609;PWD=VqUr_cA7_2Xy;"

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