const express = require('express')
const app = express()

const { getData, addOrUpdateData } = require('./dynamo')

app.get('/', (req, res) => {
    res.send('hello')
})

const port = process.env.PORT || 3000

app.get('/api/data', async (req, res) => {
    try {
        const data = await getData();
    } catch (err) {
        re.status(500).json({message: 'something went wrong'})
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})