const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = 'outrain-weather'

const getData = async () => {
    const params = {
        TableName: TABLE_NAME
    }

    const data = await dynamoClient.scan(params).promise()
    console.log(data)
    return data
}

const getDataById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id
        }
    }
    const data = await dynamoClient.get(params).promise()
    console.log(data)

    return data
}

const addOrUpdateData = async (newData) => {
    const params = {
        TableName: TABLE_NAME,
        Item: newData
    }

    return await dynamoClient.put(params).promise()
}

const deleteById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id
        }
    }
    const data = await dynamoClient.delete(params).promise()
    console.log(data)

    return data
}

module.exports = {
    dynamoClient,
    getData,
    getDataById,
    addOrUpdateData,
    deleteById
}