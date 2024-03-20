const router = require('express').Router()
const emailValidator = require('deep-email-validator');

// register
router.post('/validemailserver', async (req, res) => {
    const { EmailBody } = req.body
    let arrayEmail = [
        { 'Name': 'ELI', 'Email': 'elilucchesi@nextlevelespresso.com' },
        { 'Name': 'Tim M', 'Email': 'semplinerg@att.net' }
    ]

    try {
        let validEmails = []
        let unValidEmails = []
        for (let i = 0; i < arrayEmail.length; i++) {
            let returnemail = await emailValidator.validate(arrayEmail[i].Email)
            if (returnemail.valid || returnemail.validators.smtp.reason == 'Mail server closed connection without sending any data.') {
                console.log(arrayEmail[i], `✅ ${i}/${arrayEmail.length}`, `valid Emails: ${validEmails.length}`)
                validEmails.push(arrayEmail[i])
            } else {
                console.log(arrayEmail[i], `🔴 ${i}/${arrayEmail.length}`, `unValid Emails: ${unValidEmails.length}`)
                unValidEmails.push(arrayEmail[i])
            }
        }
        console.log(validEmails)
        console.log(unValidEmails)
        return res.send({ valid: validEmails, unvalid: unValidEmails })
    } catch (err) {
        res.status(400).send({ err: "err" })
    }
});

const extra = []




//-/////////////////-//
module.exports = router
//-/////////////////-//
