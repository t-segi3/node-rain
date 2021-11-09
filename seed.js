const { insertItemBulk } = require('./dynamo2')
const { processResponse } = require('./util/helper')

const mockResponse = require('./sample-response/api.location.1047378.json')

const seed = async () => {

    const result = await processResponse(mockResponse)

    insertItemBulk(result)
}
seed()