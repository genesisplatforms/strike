module.exports.onlyLoggedUsers = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.send({ code: res.statusCode, err: "Sensetive content for logged users only, plesae log in"})
    }
}