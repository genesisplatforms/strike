const router = require('express').Router()
const { onlyLoggedUsers } = require('../../helpers/onlyMembers');
const SQL = require('../../helpers/db');
const fetch = require('node-fetch');

// Create Notification
router.post('/createnotification', async (req, res) => {
    const { userId, title, message, type, ip } = req.body
    try {
        await SQL(`
            INSERT INTO NotificationsBB (userId, title, message, type, ip, readed)
            VALUES("${userId}","${title}","${message}","${type}","${ip}","${false}")
        `)
        res.send({msg:'succuss'})

    } catch (err) {
        res.status(400).send({ err: err })
    }
});

// gETS Notification
router.get('/getnotification', onlyLoggedUsers, async (req, res) => {
    try {onlyLoggedUsers
        const userNotifications = await SQL(`SELECT * FROM NotificationsBB where userId = "${req.session.userId}" `)
        res.send(userNotifications)
    } catch (err) {
        res.status(400).send({ err: err })
    }
});


module.exports = router
