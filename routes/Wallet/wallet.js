const router = require('express').Router()
const { onlyLoggedUsers } = require('../../helpers/onlyMembers');
const SQL = require('../../helpers/db');
const fetch = require('node-fetch');


// Create Addresses
router.post('/createAddresses', async (req, res) => {
    const { userUniqId } = req.body

    const Addresses = [
        {
            name: 'Bitcoin',
            unit: 'BTC',
            network: 'testnet',
            blockChain: 'bitcoin',
            networkToDisplay: '',
            img: 'https://w7.pngwing.com/pngs/927/841/png-transparent-bitcoin-logo-cryptocurrency-ethereum-bitcoin-text-orange-logo-thumbnail.png'
        },
        {
            name: 'Ethereum',
            unit: 'ETH',
            network: 'goerli',
            blockChain: 'ethereum',
            networkToDisplay: 'ERC20 Network',
            img: 'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png'
        }
    ]

    try {
        for (let i = 0; i < Addresses.length; i++) {
            // Create Ethereum
            const ethereumAddress = await fetch(`https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/${Addresses[i].blockChain}/${Addresses[i].network}/addresses`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                },
                body: JSON.stringify({
                    "context": userUniqId,
                    "data": {
                        "item": {
                            "label": userUniqId
                        }
                    }
                })
            })
            const dataEthereumAddress = await ethereumAddress.json();
            console.log(dataEthereumAddress)

            // Insert user wallet information to database
            await SQL(`
                INSERT INTO AddressBB (
                    userId,
                    address,
                    network,
                    networkToDisplay,
                    blockChain,
                    name,
                    unit,
                    img,
                    amount
                )
                VALUES(
                    "${userUniqId}",
                    "${dataEthereumAddress.data.item.address}",
                    "${Addresses[i].network}",
                    "${Addresses[i].networkToDisplay}",
                    "${Addresses[i].blockChain}",
                    "${Addresses[i].name}",
                    "${Addresses[i].unit}",
                    "${Addresses[i].img}",
                    "${0.00000}"
                )
        `)
        }
        res.send({ msg: 'success' })
    } catch (error) {
        res.send({ err: error })
    }

});

// Get Addresses
router.get('/getAddresses', onlyLoggedUsers, async (req, res) => {
    try {
        const userEmailCheck = await SQL(`SELECT * FROM AddressBB where userId = "${req.session.userId}" `)
        res.send(userEmailCheck)
    } catch (error) {
        res.send({ err: error })
    }

});

// Get Withdraw Coins
router.post('/withdrawCoins', onlyLoggedUsers, async (req, res) => {
    const {
        // CryptoApi
        blocChain, network, recipientAddress, amount,
        // DataBase
        type, img, unit, amountExchange, name, txid

    } = req.body

    try {
        const withdrawCoins = await fetch(`https://rest.cryptoapis.io/wallet-as-a-service/wallets/62e293d30a337500068fe750/${blocChain}/${network}/addresses/0xf4353aa117c3d978e31df8fe4be34b43eab1f042/transaction-requests`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
            },
            body: JSON.stringify({
                "context": req.session.userId,
                "data": {
                    "item": {
                        // "callbackSecretKey": "yourSecretKey",
                        // "callbackUrl": "https://example.com",
                        "feePriority": "standard",
                        "note": "Test",
                        // "prepareStrategy": "minimize-dust",
                        "recipients": [
                            {
                                "address": recipientAddress,
                                "amount": amount
                            }
                        ]
                    }
                }
            })
        })
        const dataWithdrawCoins = await withdrawCoins.json();
        res.send(dataWithdrawCoins)

        // Insert user wallet information to database
        await SQL(`
                INSERT INTO TransactionsBB (
                    userId,
                    type,
                    img,
                    unit,
                    amount,
                    amountExchange,
                    name,
                    destination,
                    txid
                )
                VALUES(
                    "${req.session.userId}",
                    "${type}",
                    "${img}",
                    "${unit}",
                    "${amount}",
                    "${amountExchange}",
                    "${name}",
                    "${recipientAddress}",
                    "${txid}"
                )
        `)
        res.send({msg:'succuss'})
    } catch (err) {
        res.send({ err: err })
    }
});

// Get Transactions
router.get('/getTransactions', onlyLoggedUsers, async (req, res) => {
    try {
        const userTransactions = await SQL(`SELECT * FROM TransactionsBB where userId = "${req.session.userId}" `)
        res.send(userTransactions)
    } catch (error) {
        res.send({ err: error })
    }

});




// 




router.get('/getAddressAssets', onlyLoggedUsers, async (req, res) => {
    try {
        (async () => {
            const userDetails = await SQL(`SELECT * FROM WalletsBB where userId = "${req.session.userId}" `)

            // Get Bitcoin Details
            const bitcoinAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/bitcoin/testnet/addresses/${userDetails[0].bitcoinAddress}?context=${userDetails[0].bitcoinAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataBitcoin = await bitcoinAddress.json();
            // Get BitcoinCash Details
            const bitcoinCashAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/bitcoin-cash/testnet/addresses/${userDetails[0].bitcoinCashAddress}?context=${userDetails[0].bitcoinCashAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const databitcoinCash = await bitcoinCashAddress.json();
            // Get Ethereum Details
            const ethereumAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/ethereum/ropsten/addresses/${userDetails[0].ethereumAddress}?context=${userDetails[0].ethereumAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataEthereum = await ethereumAddress.json();
            // Get Usdt Details
            const usdtAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/ethereum/ropsten/addresses/${userDetails[0].ethereumAddress}/tokens?context=${userDetails[0].ethereumAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataUsdt = await usdtAddress.json();
            // Get LitecoinAddress Details
            const litecoinAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/litecoin/testnet/addresses/${userDetails[0].litecoinAddress}?context=${userDetails[0].litecoinAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataLitecoin = await litecoinAddress.json();
            // Get Dogecoin Details
            const dogecoinAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/dogecoin/testnet/addresses/${userDetails[0].dogecoinAddress}?context=${userDetails[0].dogecoinAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataDogecoin = await dogecoinAddress.json();
            // Get BinanceSmartChain Details
            const binanceSmartChainAddress = await fetch(`https://rest.cryptoapis.io/v2/blockchain-data/binance-smart-chain/testnet/addresses/${userDetails[0].binanceSmartChainAddress}?context=${userDetails[0].binanceSmartChainAddress}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
                }
            })
            const dataBinanceSmartChain = await binanceSmartChainAddress.json();


            // Add Address to object
            dataBitcoin.address = userDetails[0].bitcoinAddress
            databitcoinCash.address = userDetails[0].bitcoinCashAddress
            dataEthereum.address = userDetails[0].ethereumAddress
            dataUsdt.address = userDetails[0].ethereumAddress
            dataLitecoin.address = userDetails[0].litecoinAddress
            dataDogecoin.address = userDetails[0].dogecoinAddress
            dataBinanceSmartChain.address = userDetails[0].binanceSmartChainAddress


            // Add images to object
            dataBitcoin.img = "https://w7.pngwing.com/pngs/927/841/png-transparent-bitcoin-logo-cryptocurrency-ethereum-bitcoin-text-orange-logo-thumbnail.png"
            databitcoinCash.img = "https://upload.wikimedia.org/wikipedia/commons/5/58/Bitcoin_Cash.png"
            dataEthereum.img = "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
            dataUsdt.img = "https://w7.pngwing.com/pngs/803/844/png-transparent-usdt-crypto-cryptocurrency-cryptocurrencies-cash-money-bank-payment-icon-thumbnail.png"
            dataLitecoin.img = "https://w7.pngwing.com/pngs/662/818/png-transparent-litecoin-cryptocurrency-bitcoin-logo-bitcoin-logo-payment-bitcoin-thumbnail.png"
            dataDogecoin.img = "https://w7.pngwing.com/pngs/901/823/png-transparent-dogecoin-cryptocurrency-dash-digital-currency-doge-mammal-cat-like-mammal-carnivoran-thumbnail.png"
            dataBinanceSmartChain.img = "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png"

            // Add name to object
            dataBitcoin.name = "Bitcoin"
            databitcoinCash.name = "Bitcoin Cash"
            dataEthereum.name = "Ethereum"
            dataUsdt.name = "Theater"
            dataLitecoin.name = "Lite Coin"
            dataDogecoin.name = "Doge Coin"
            dataBinanceSmartChain.name = "Binance Coin"

            // Add Symbol to object
            dataBitcoin.symbol = "BTC"
            databitcoinCash.symbol = "BCH"
            dataEthereum.symbol = "ETH"
            dataUsdt.symbol = "USDT"
            dataLitecoin.symbol = "LTC"
            dataDogecoin.symbol = "DOGE"
            dataBinanceSmartChain.symbol = "BNB"

            // Add BlockChain to object
            dataBitcoin.blockchain = "bitcoin"
            databitcoinCash.blockchain = "bitcoin-cash"
            dataEthereum.blockchain = "ethereum"
            dataUsdt.blockchain = "ethereum"
            dataLitecoin.blockchain = "litecoin"
            dataDogecoin.blockchain = "dogecoin"
            dataBinanceSmartChain.blockchain = "binance-smart-chain"

            // Add Block Chain to display
            dataBitcoin.blockchainToDisplay = ""
            databitcoinCash.blockchainToDisplay = ""
            dataEthereum.blockchainToDisplay = "ERC20 Network"
            dataUsdt.blockchainToDisplay = "ERC20 Network"
            dataLitecoin.blockchainToDisplay = ""
            dataDogecoin.blockchainToDisplay = ""
            dataBinanceSmartChain.blockchainToDisplay = "BEP20 Network"

            const FinalData = {
                dataBitcoin: dataBitcoin,
                databitcoinCash: databitcoinCash,
                dataEthereum: dataEthereum,
                dataUsdt: dataUsdt,
                dataLitecoin: dataLitecoin,
                dataDogecoin: dataDogecoin,
                dataBinanceSmartChain: dataBinanceSmartChain
            }

            res.send(FinalData)
        })()
    } catch (err) {
        res.send({ err: err })
    }
});

router.get('/getAllAssets', async (req, res) => {
    try {
        // const userDetails = await SQL(`SELECT userAddressEth, userAddressBtc FROM usersBB where userId = "${req.session.userId}" `)
        const mainUrl = `https://rest.cryptoapis.io/v2/wallet-as-a-service/wallets/62e293d30a337500068fe750/assets?context=yourExampleString`
        const res1 = await fetch(mainUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": '80c656ce506828e4129251e8c3bee5dd3521dcd6'
            }
        })
        let data = await res1.json();
        // // Find index of assets
        // const indexBTC = data.data.item.coins.findIndex(a => a.unit === 'BTC')
        // const indexETH = data.data.item.coins.findIndex(a => a.unit === 'ETH')
        // // Add addresses for each assets to differintate
        // data.data.item.coins[indexBTC].address = userDetails[0].userAddressBtc
        // data.data.item.coins[indexETH].address = userDetails[0].userAddressEth
        // Send
        res.send(data)
    } catch (err) {
        res.send({ err: err })
    }
});
module.exports = router
