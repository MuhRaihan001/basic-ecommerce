const sql = require("../../database");

const executeQuery = (query, params = [])=>{
    return new Promise((resolve, reject)=>{
        sql.query(query, params, (error, result)=>{
            if(error){
                console.error("SQL Error:", error);
                reject(error);
            }else{
                resolve(result);
            }
        });
    });
}

module.exports = { executeQuery }