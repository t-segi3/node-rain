const axios = require('axios')

const { insertItemBulk, getRecentData } = require('./dynamo2')
const { sleep, processResponse } = require('./util/helper')

const url = 'https://www.metaweather.com/api/'

const _fetchNewPrediction = async (woeid) => {

    try {
        const response = await axios.get(url + 'location/' + woeid + '/')
        console.log('finished fetching new predictions')
        return response.data

    } catch (err) {
        console.log(err)
    }
}

const _addNewPrediction = async (woeid) => {

    const newPreds = await _fetchNewPrediction(woeid)

    const result = await processResponse(newPreds)

    insertItemBulk(result)

    console.log('finished inserting new predictions')
}

// ! _addNewPrediction(1047378)

const getPredictions = async (woeid, start, finish) => {

    var result = await getRecentData(woeid, start, finish)
    
    if (result.Count != 6) {
        console.log('tidak 6') // fetch baru dulu

        const newPreds = await _addNewPrediction(woeid)

        await sleep(2000)

        result = await getRecentData(woeid, start, finish)
        console.log('finished patching holes')
    } 

    var response = []

    for (var i = 0; i < result.Count; i++) {
        response.push(result.Items[i].attrs)
    }

    console.log(response)

    return response
}

module.exports = {
    getPredictions
}

// getPredictions(1047378, '2021-11-12', '2021-11-17')