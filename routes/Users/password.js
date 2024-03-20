const router = require('express').Router()
const { onlyLoggedUsers } = require('../../helpers/onlyMembers');
const SQL = require('../../helpers/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const path = require('path');
const fs = require('fs');

const validEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    return re.test(email);
};

//Forgot Password
router.post('/forgotpassword', async (req, res) => {
    const { userEmail } = req.body
    try {
        // Check Credensial
        if (!userEmail) {
            return res.send({
                msg: "Missing some info",
                err: {
                    userEmail: userEmail ? true : false,
                }
            })
        }

        // Check valid credensial
        if (!validEmail(userEmail)) {
            return res.send({
                err: {
                    email: {
                        msg: `Invalid email`,
                        valid: validEmail(userEmail)
                    }
                }
            })
        }
        // selecet user from data
        const user = await SQL(`SELECT userEmail, userId FROM UsersBB WHERE userEmail = "${userEmail}"`)
        // SendCode
        if (user.length) {
            const userToken = Math.floor(100000 + Math.random() * 900000)
            const filePath = path.join(__dirname, './views/ResetPassword.html');
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            const replacements = {
                userEmail: userEmail,
                link: `http://localhost:1000/resetpassword?id=${user[0].userId}&token=${userToken}`
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
                from: '"BetsBling" 🎰 <do_not_reply@BetsBling.com>',
                to: "snireluzttt@gmail.com",
                subject: "Reset your password 🔐",
                html: htmlToSend,
                // html: `<b>Your code is http://localhost:1000/resetpassword?id=${user[0].userId}&token=${userToken}</b>`,
            };
            // UpdateUserToken
            await SQL(`UPDATE usersBB SET userToken = "${userToken}" WHERE userId = "${user[0].userId}"`)

            // SendMail
            transporter.sendMail(info, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    return res.send({ msg: 'succus' })
                }
            })
        }

        return res.send({ msg: 'succus' })
    } catch (err) {
        res.status(400).send({ err: err })
    }
})
// ResetPassword
router.post('/resetpassword', async (req, res) => {
    const { userId, userToken, userPassword, userPasswordRepeat } = req.body
    try {
        // Check Credensial
        if (!userPassword || !userPasswordRepeat) {
            return res.send({
                msg: "Missing some info",
                err: {
                    userPasswordRepeat: userPasswordRepeat ? true : false,
                    userPassword: userPassword ? true : false
                }
            })
        }
        // Check valid credensial
        if (userPassword.length < 8 || userPasswordRepeat.length < 8) {
            return res.send({
                err: {
                    userPassword: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userPassword.length >= 8 ? true : false
                    },
                    userPasswordRepeat: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userPasswordRepeat.length >= 8 ? true : false
                    }
                }
            })
        }
        // Check MatchPassowrd
        if (userPassword != userPasswordRepeat) {
            return res.send({
                errMatch: `The passwords do not match.`,
            })
        }
        const user = await SQL(`SELECT userId, userToken FROM usersBB WHERE userToken = "${userToken}"`)
        if (user.length && user[0].userId == userId && user[0].userToken == userToken) {
            const hash = bcrypt.hashSync(userPasswordRepeat, 10);
            await SQL(`UPDATE usersBB SET userPassword = "${hash}" WHERE userId = "${user[0].userId}"`)
            await SQL(`UPDATE usersBB SET userToken = "${null}" WHERE userId = "${user[0].userId}"`)
            res.send({ msg: 'seccuss' })
        } else {
            res.send({ err: 'wrong credential' })
        }
    } catch (err) {
        res.status(400).send(res.send({ err: err }))
    }
})
// ChangePassword
router.post('/changepassword', onlyLoggedUsers, async (req, res) => {
    const { userCurrentPassword, userPassword } = req.body
    try {
        // Check Credensial
        if (!userCurrentPassword || !userPassword) {
            return res.send({
                msg: "Missing some info",
                err: {
                    userCurrentPassword: userCurrentPassword ? true : false,
                    userPassword: userPassword ? true : false
                }
            })
        }
        // Check valid credensial
        if (userCurrentPassword.length < 8 || userPassword.length < 8) {
            return res.send({
                err: {
                    userCurrentPassword: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userCurrentPassword.length >= 8 ? true : false
                    },
                    userPassword: {
                        msg: `Password must be at least 8 characters.`,
                        valid: userPassword.length >= 8 ? true : false
                    }
                }
            })
        }
        // Check Current Password
        const user = await SQL(`SELECT userPassword FROM usersBB WHERE userId = "${req.session.userId}"`)
        const hash = bcrypt.compareSync(userCurrentPassword, user[0].userPassword);
        if (hash) {
            const hash2 = bcrypt.hashSync(userPassword, 10);
            await SQL(`UPDATE usersBB SET userPassword = "${hash2}" WHERE userId = "${req.session.userId}"`)
            return res.send({ msg: 'ok' })
        } else {
            return res.send({ err: "Invalid Credential" })
        }
    } catch (err) {
        res.status(400).send(res.send({ err: err }))
    }
})
// ChangePassword
router.post('/changephonenumber', onlyLoggedUsers, async (req, res) => {
    const { userPhoneNumber } = req.body
    try {
        // Update PhoneNumber (Validation on client)
        await SQL(`UPDATE usersBB SET userPhoneNumber = "${userPhoneNumber}" WHERE userId = "${req.session.userId}"`)
        return res.send({ err: "Ok" })
    } catch (err) {
        res.status(400).send(res.send({ err: err }))
    }
})

module.exports = router
