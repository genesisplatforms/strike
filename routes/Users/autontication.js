const router = require('express').Router()
const { onlyLoggedUsers } = require('../../helpers/onlyMembers');
const SQL = require('../../helpers/db');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
// nodemailer
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const path = require('path');
const fs = require('fs');

const getDate = (days) => {
    let today = new Date();
    let datePlus = today.setDate(today.getDate() + days)
    let hey = new Date(datePlus)
    return hey.toISOString().split('T')[0].split('-').reverse().join('-') + ' ' + (today.getHours() < 10 ? '0' + today.getHours() : today.getHours()) + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
}
const validEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    return re.test(email);
};
const validPassword = (email) => {
    var re = /^(?=.*[A-Za-z])[A-Za-z\d@$!%*#?&=~()""''_+[{};:-<>,.`]{8,}$/;
    return re.test(email);
};

// register
router.post('/register', async (req, res) => {
    const { userEmail, userPassword, userCode, userTerms } = req.body
    const userUniqId = uuidv4()
    try {
        // Check Credensial
        if (!userEmail || !userPassword || !userTerms) {
            return res.send({
                msg: "Missing some info",
                err: {
                    userEmail: userEmail ? true : false,
                    userPassword: userPassword ? true : false,
                    userTerms: userTerms ? true : false
                }
            })
        }
        // Check valid credensial
        if (!validEmail(userEmail) || userPassword.length < 8) {
            return res.send({
                err: {
                    email: {
                        msg: `Invalid email`,
                        valid: validEmail(userEmail)
                    },
                    password: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userPassword.length >= 8 ? true : false
                    }
                }
            })
        }
        // Check if Useremail or Username is exist
        const userEmailCheck = await SQL(`SELECT userEmail FROM UsersBB where userEmail = "${userEmail}" `)
        if (userEmailCheck.length) {
            return res.send({
                msg: "Users info is already taken",
                err: {
                    userEmailCheck: userEmailCheck.length ? true : false
                }
            })
        }
        // Bycrypt Password
        const hash = bcrypt.hashSync(userPassword, 10);
        // Insert user information to database
        await SQL(`
            INSERT INTO UsersBB (userId, userWalletId, userEmail, userPassword, userPhoneNumber, userCode, userTerms, userToken)
            VALUES("${userUniqId}","${null}","${userEmail}","${hash}","${null}","${userCode}","${userTerms}","${null}")
        `)

        // Create Addresses
        await fetch(`http://localhost:1000/api/wallet/createAddresses`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                userUniqId: userUniqId
            })
        })

        // Send Email
        const sendEmail = () => {
            const filePath = path.join(__dirname, './views/WelcomeSignUp.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            const replacements = {
                name: userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1),
                email: userEmail,
                link: "http://localhost:1000",
            };
            const htmlToSend = template(replacements);
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "snireluzttt@gmail.com",
                    pass: "hpzvordwmvmelxcx",
                },
            });
            // send mail with defined transport object
            let info = {
                from: '"BetsBling" 🎰 <do_not_reply@BetsBling.com',
                to: "snireluzttt@gmail.com",
                subject: `${userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)}, welcome to BetsBling.com!`,
                html: htmlToSend,
            };

            // SendMail
            transporter.sendMail(info, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Ok')
                }
            })
        }
        sendEmail()

        // Set session
        req.session.userId = userUniqId
        res.send({ msg: "User created" })
    } catch (err) {
        res.status(400).send({ err: err })
    }
});
// login
router.post('/login', async (req, res) => {
    const {
        // Login
        userEmail, userPassword,
        // Notifications
        title, message, type, ip
    } = req.body
    try {
        // Check Credensial
        if (!userEmail || !userPassword) {
            return res.send({
                msg: "Missing some info",
                err: {
                    userEmail: userEmail ? true : false,
                    userPassword: userPassword ? true : false,
                }
            })
        }
        // Check valid credensial
        if (!validEmail(userEmail) || userPassword.length < 8) {
            return res.send({
                err: {
                    email: {
                        msg: `Invalid email`,
                        valid: validEmail(userEmail)
                    },
                    password: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userPassword.length >= 8 ? true : false
                    }
                }
            })
        }
        // Check Correct Credential
        const user = await SQL(`SELECT userEmail, userPassword, userId FROM usersBB WHERE userEmail = "${userEmail}"`)
        // Load hash from your password DB.
        if (!user.length) { return res.send({ err: "Incorrect Email or Password" }) }
        const hash = bcrypt.compareSync(userPassword, user[0].userPassword);
        if (!hash) { return res.send({ err: "Incorrect Email or Password" }) }
        // Set session
        if (user.length && hash) {
            // Set Notifications
            const createNotification = await fetch('http://localhost:1000/api/users/createnotification',{
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    userId: user[0].userId,
                    title: title,
                    message: message,
                    type: type,
                    ip: ip
                })
            })
            const dataCreateNotification = await createNotification.json()
            console.log(dataCreateNotification)

            req.session.userId = user[0].userId
            res.send({ msg: "Login Succes" })
        }

    } catch (err) {
        res.status(400).send({ err: err })
    }
});
// logout
router.delete('/logout', onlyLoggedUsers, (req, res) => {
    if (!req.session.userId) {
        return res.send({ err: "you are not logged" })
    }
    req.session.destroy()
    res.send({ msg: "bye bye! it was nice to see you again" })
})
// userSession
router.get('/userSession', onlyLoggedUsers, async (req, res) => {
    try {
        const user = await SQL(`SELECT userId FROM usersBB WHERE userId = "${req.session.userId}"`,)
        res.send({ msg: user[0].userId })
    } catch (err) {
        res.status(400).send({ err: err })
    }
})
// GetUserInformaitonSecurity
router.get('/getuserinformationsecurity', onlyLoggedUsers, async (req, res) => {
    try {
        const user = await SQL(`SELECT userEmail, userPhoneNumber FROM usersBB WHERE userId = "${req.session.userId}"`)
        return res.send({ msg: user[0] })
    } catch (err) {
        res.status(400).send(res.send({ err: err }))
    }
})

module.exports = router













// // register
// router.post('/register', async (req, res) => {
//     const { userEmail, userPassword, userCode, userTerms } = req.body
//     const userUniqId = uuidv4()
//     try {
//         // Create User ////////////////////////////////

//         // Check Credensial
//         if (!userEmail || !userPassword || !userTerms) {
//             return res.send({
//                 msg: "Missing some info",
//                 err: {
//                     userEmail: userEmail ? true : false,
//                     userPassword: userPassword ? true : false,
//                     userTerms: userTerms ? true : false
//                 }
//             })
//         }
//         // Check valid credensial
//         if (!validEmail(userEmail) || userPassword.length < 8) {
//             return res.send({
//                 err: {
//                     email: {
//                         msg: `Invalid email`,
//                         valid: validEmail(userEmail)
//                     },
//                     password: {
//                         msg: `Password must be at least 8 characters.`,
//                         valid: userPassword.length >= 8 ? true : false
//                     }
//                 }
//             })
//         }
//         // Check if Useremail or Username is exist
//         const userEmailCheck = await SQL(`SELECT userEmail FROM UsersBB where userEmail = "${userEmail}" `)
//         if (userEmailCheck.length) {
//             return res.send({
//                 msg: "Users info is already taken",
//                 err: {
//                     userEmailCheck: userEmailCheck.length ? true : false
//                 }
//             })
//         }
//         // Bycrypt Password
//         const hash = bcrypt.hashSync(userPassword, 10);
//         // Insert user information to database
//         await SQL(`
//             INSERT INTO UsersBB (userId, userWalletId, userEmail, userPassword, userPhoneNumber, userCode, userTerms, userToken)
//             VALUES("${userUniqId}","${null}","${userEmail}","${hash}","${null}","${userCode}","${userTerms}","${null}")
//         `)

//         // Create User Walet ////////////////////////////////
//         // Create Bitcoin
//         const bitcoinAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/bitcoin/testnet/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const dataBitcoinAddress = await bitcoinAddress.json();
//         // Create BitcoinCash
//         const bitcoinCashAddressAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/bitcoin-cash/testnet/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const databitcoinCashAddress = await bitcoinCashAddressAddress.json();
//         // Create Ethereum
//         const ethereumAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/ethereum/ropsten/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const dataEthereumAddress = await ethereumAddress.json();
//         // Create LitecoinAddress
//         const litecoinAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/litecoin/testnet/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const dataLitecoinAddress = await litecoinAddress.json();
//         // Create Dogecoin
//         const dogecoinAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/dogecoin/testnet/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const dataDogecoinAddress = await dogecoinAddress.json();
//         // Create BinanceSmartChain
//         const binanceSmartChainAddress = await fetch('https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/binance-smart-chain/testnet/addresses', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
//             },
//             body: JSON.stringify({
//                 "context": userUniqId,
//                 "data": {
//                     "item": {
//                         "label": userUniqId
//                     }
//                 }
//             })
//         })
//         const dataBinanceSmartChainAddress = await binanceSmartChainAddress.json();
//         // Insert user wallet information to database
//         await SQL(`
//             INSERT INTO WalletsBB (userId, walletId, bitcoinAddress, bitcoinCashAddress, ethereumAddress, litecoinAddress, dogecoinAddress, binanceSmartChainAddress)
//             VALUES("${userUniqId}","62e293d30a337500068fe750","${dataBitcoinAddress.data.item.address}","${databitcoinCashAddress.data.item.address}","${dataEthereumAddress.data.item.address}","${dataLitecoinAddress.data.item.address}","${dataDogecoinAddress.data.item.address}","${dataBinanceSmartChainAddress.data.item.address}")
//             `)
//         ////////////////////////////////////////////////////////////////

//         // Create User ////////////////////////////////
//         const filePath = path.join(__dirname, './views/WelcomeSignUp.html');
//         const source = fs.readFileSync(filePath, 'utf-8').toString();
//         const template = handlebars.compile(source);
//         const replacements = {
//             name: userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1),
//             email: userEmail,
//             link: "http://localhost:1000",
//         };
//         const htmlToSend = template(replacements);
//         // create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: "snireluzttt@gmail.com",
//                 pass: "hpzvordwmvmelxcx",
//             },
//         });
//         // send mail with defined transport object
//         let info = {
//             from: '"BetsBling" 🎰 <do_not_reply@BetsBling.com',
//             to: "snireluzttt@gmail.com",
//             subject: `${userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1)}, welcome to BetsBling.com!`,
//             html: htmlToSend,
//         };

//         // SendMail
//         transporter.sendMail(info, (err) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 console.log('Ok')
//             }
//         })
//         ////////////////////////////////////////////////////////////////

//         // Set session
//         req.session.userId = userUniqId
//         res.send({ msg: "User created" })
//     } catch (err) {
//         res.status(400).send({ err: err })
//     }
// });

