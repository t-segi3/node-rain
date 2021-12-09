require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('hello')
})

const { getPredictions } = require('./apiController')

app.get('/api/getPrediction', async (req, res) => {
    
    const { woeid } = req.query

    let today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();

    let next6days = new Date(today);
    next6days.setDate(today.getDate() + 5)
    let dateF = ("0" + next6days.getDate()).slice(-2);
    let monthF = ("0" + (next6days.getMonth() + 1)).slice(-2);
    let yearF = next6days.getFullYear();

    const weatherPredictions = await getPredictions(woeid, year + "-" + month + "-" + date, yearF + "-" + monthF + "-" + dateF)

    res.status(200).send({
        start: year + "-" + month + "-" + date,
        finish: yearF + "-" + monthF + "-" + dateF,
        woeid: woeid,
        data: weatherPredictions,
    })
})

const { searchByCityName } = require('./geo-coder')

app.get('/api/searchByCity', async (req, res) => {
    const { city } = req.query

    const result = await searchByCityName(city)

    res.status(200).send(result)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})