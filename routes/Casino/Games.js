const router = require('express').Router()
const { onlyLoggedUsers } = require('../../helpers/onlyMembers');
const SQL = require('../../helpers/db');
// Data
const GamesLiveData = require('../../Services/GamesLive')
const GamesSlotsData = require('../../Services/GamesSlots')

// Get Games
router.get('/games', (req, res) => {
    try {
        const LivesGamesArray = []
        LivesGamesArray.push({ link: "lives", Category: "Lives", Games: GamesLiveData.filter(a => a.gameId == 7049 || a.gameId == 4835 || a.gameId == 4854 || a.gameId == 6361 || a.gameId == 6490 || a.gameId == 6514 || a.gameId == 6567 || a.gameId == 6529 || a.gameId == 7081) })
        LivesGamesArray.push({ link: "slots", Category: "Slots", Games: GamesSlotsData.filter(a => a.is_top == true || a.is_recommended == true).slice(0, 20) })

        const SlotsGamesArray = []
        SlotsGamesArray.push({ link: "Recomended", Category: "Recomended", Games: GamesSlotsData.filter(a => a.is_top == true && a.is_recommended == true).slice(0, 20) })
        SlotsGamesArray.push({ link: "Table games", Category: "Table Games", Games: GamesSlotsData.filter(a => a.category == 'BlackJack' && a.rating >= 10 || a.category == 'Table games' && a.rating >= 10 || a.category == 'Roulette' && a.rating >= 10) })
        SlotsGamesArray.push({ link: "New Releases", Category: "New Releases", Games: GamesSlotsData.filter(a => a.is_new == true).slice(0, 20) })

        finalArray = { LivesGamesArray: LivesGamesArray, SlotsGamesArray: SlotsGamesArray }
        res.send(finalArray)
    } catch (error) {
        res.send({ err: error })
    }
})

// "Slots", "Video Poker", "War", "BlackJack", "Table games", "Roulette", "Sic Bo", "Sic Bo Live", "Instant Win", "Bingo", "Scratch Games", "Casino Games", "Fishing games"

router.post('/games/:category', (req, res) => {
    const { category } = req.params
    const { offset, limit, sort } = req.body
    try {
        let link = ''
        if (category.indexOf('%20') > -1) {
            link = category.split('%20')[0] + ' ' + category.split('%20')[1]
        } else {
            link = category.charAt(0).toUpperCase() + category.slice(1)
        }

        function GetProviders(leagues) {
            // const categories = [...new Set(leagues.filter(a => a.soft == "Gamzix" || a.soft == "Gamzix").map(follower => follower.soft))]

            const categories = [...new Set(leagues.map(follower => follower.soft))]
            return categories.reduce((acc, description, index) => {
                const _leagues = leagues.filter(follower => follower.soft === description)
                return [...acc, { Provider: description, Games: _leagues.filter(a => a.category == link) }]
            }, [])
        }
        const providers = GetProviders(GamesSlotsData)

        if (req.query.sort == 'asc') {
            GamesSlotsData.sort((a, b) => a.name.localeCompare(b.name))
        } else if (req.query.sort == 'desc') {
            GamesSlotsData.sort((a, b) => b.name.localeCompare(a.name))
        } else if (req.query.sort == 'popular') {
            GamesSlotsData.sort((a, b) => { return b.is_recommended - a.is_recommended || b.is_top - a.is_top })
        } else if (req.query.sort == 'rating') {
            GamesSlotsData.sort(function (a, b) { return b.rating - a.rating })
        }

        const LivesGamesArray = []
        LivesGamesArray.push({
            Category: category,
            Games: GamesSlotsData.filter(a => a.category == link).slice(offset, limit),
            GamesLength: GamesSlotsData.filter(a => a.category == link).length,
            Providers: providers.filter(a => a.Games.length > 0).sort((a, b) => { return a.Provider.localeCompare(b.Provider) })
        })

        res.send(LivesGamesArray[0])

    } catch (error) {
        res.send({ err: error })
    }
})

module.exports = router


// function GamesLiveDataFun(leagues) {
//     const categories = [...new Set(leagues.map(follower => follower.category))]
//     return categories.reduce((acc, description, index) => {
//         const _leagues = leagues.filter(follower => follower.category === description)
//         return [...acc, { Category: description }]
//     }, [])
// }