const express = require('express');
const session = require('express-session');
const subdomain = require('express-subdomain');

const cors = require('cors');
const path = require('path');


const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(session({
    secret: "HereIsWhyWeBetsBlingBB",
    name: "Main",
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    }
}))
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// EmailValid
app.use('/api/valid', require('./routes/EmailVald/emailvalid'))
app.use('/api/users', require('./routes/Users/autontication'))
app.use('/api/users', require('./routes/Users/password'))
app.use('/api/users', require('./routes/Users/notifications'))
app.use('/api/wallet', require('./routes/Wallet/wallet'))
app.use('/api/casino', require('./routes/Casino/Games'))

app.get('/', (req, res) => {
    res.send({ msg: "seccess" })
})

if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === "production") {

    app.use(express.static(path.join(__dirname, 'clinet/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    })
}
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname +'/client/build/index.html'));
// });
app.listen(1000, function () {
    console.log("Express server listening")
})


// app.use(express.static('build'));
// app.listen(process.env.PORT || 1000);