const mysql = require('mysql')

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'Aznir11.',
    database: 'sys',
});
// const db = mysql.createConnection({
//     host: 'eu-cdbr-west-03.cleardb.net',
//     user: 'b254fdab4ab83b',
//     password: 'aa4f8d25',
//     database: 'heroku_f8f7ca473caa9d3',
// });
db.connect(err => {
    if (err) {
        return console.log("Connect has been cancel", err);
    }
    console.log("Data has been seccessfuly connected");
})

const SQL = (q) => {
    return new Promise((resolve, reject) => {
        db.query(q, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


module.exports = SQL




