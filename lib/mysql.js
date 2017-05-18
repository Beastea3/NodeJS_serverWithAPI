// to connect the mysql database and create a connection pool
var mysql=require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'timetrack',
});

var mysqlQuery=function(sql,Values,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,Values,function(err,results,fields){
                //release connection;
                conn.release();
                //event call-back;
                callback(err,results,fields);

            });
        }
    });
};

module.exports=mysqlQuery;
