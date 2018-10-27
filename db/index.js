const {Pool,Client } = require('pg')
var databaseConfig = require('../config.json');
const pool = new Pool(databaseConfig);

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
    connect:(cb)=>{
        pool.connect(cb);
    }
}