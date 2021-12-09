require('dotenv').config()

const AWS = require('aws-sdk')
const dynamo = require('dynamodb')
const Joi = require('joi')

dynamo.AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

// model
var Weather_Prediction = dynamo.define('Weather_Prediction', {
    hashKey: 'woeid',
    rangeKey: 'applicable_date',
    timestamps: true,
    schema: {
        title: Joi.string(),
        location_type: Joi.string(),
        woeid: Joi.number(),
        latt_long: Joi.string(),
        timezone: Joi.string(),
        applicable_date: Joi.string(),
        consolidated_weather: {
            id: Joi.number(),
            weather_state_name: Joi.string(),
            weather_state_abbr: Joi.string(),
            wind_direction_compass: Joi.string(),
            created: Joi.string(),
            applicable_date: Joi.string(),
            min_temp: Joi.number(),
            max_temp: Joi.number(),
            the_temp: Joi.number(),
            wind_speed: Joi.number(),
            wind_direction: Joi.number(),
            air_pressure: Joi.number(),
            humidity: Joi.number(),
            visibility: Joi.number(),
            predictability: Joi.number()
        }
    },
    tableName: 'weatherPredictions'
})

const createTable = () => {
    // create table
    dynamo.createTables({
        'Weather_Prediction': {
            readCapacity: 5,
            writeCapacity: 10
        }
    }, function (err) {
        if (err) {
            console.log('Error creating tables: ', err)
        } else {
            console.log('Tables has been created')
        }
    })
}
// createTable()

// create new entry
const insertItem = (newData) => {
    var newPredict = new Weather_Prediction({
        title: "Bali",
        location_type: "TestBeda",
        woeid: 1047378,
        latt_long: "-6.171440,106.827820",
        timezone: "Asia/Jakarta",
        applicable_date: "2021-11-04",
        consolidated_weather: {
            id: 6327273419440128,
            weather_state_name: "Heavy Rain",
            weather_state_abbr: "hr",
            wind_direction_compass: "NNW",
            created: "2021-11-04T10:09:11.260055Z",
            applicable_date: "2021-11-04",
            min_temp: 25.92,
            max_temp: 32.99,
            the_temp: 32.285000000000004,
            wind_speed: 6.001892535398606,
            wind_direction: 348.7482456824299,
            air_pressure: 1009.0,
            humidity: 66,
            visibility: 12.846228028314641,
            predictability: 77
        }
    })

    newPredict.save((err) => {
        if (err) {
            console.log('error in saving account', err);
        } else {
            console.log('created account in DynamoDB', newPredict.get('latt_long'));
        }
    })
}
// insertItem()

// create item in bulk
const insertItemBulk = (arrOfItem) => {

    Weather_Prediction.create(arrOfItem, function (err, acc) {
        console.log('insert success');
    });
}

// query 5 recent
const getRecentData = async (woeid, start, finish) => {
    console.log('getting recent data')
    return new Promise((resolve, reject) => {
        Weather_Prediction
        .query(parseInt(woeid))
        .where('applicable_date').between(start, finish)
        .limit(6)
        .exec((err, acc) => {
            if (err) {
                console.log('err', err)
            }
            console.log('count result', acc.Count)
            resolve(acc)
        })
    })
}



// get item
const getItem = async (date, title) => {
    Weather_Prediction.get('2021-11-04', 'Jakarta', (err, acc) => {
        console.log('got prediction', acc)
    })
}
// getItem()

const getItemAwait = async (date, title) => {
    return new Promise((resolve, reject) => {
        Weather_Prediction.get('2021-11-05', (err, acc) => {
            if (err) {
                reject(err)
            }
            // console.log('got prediction', acc.get('latt_long'))
            resolve(acc)
        })
    })

}

const test = async () => {
    let res = await getItemAwait()
    if (res == null) {
        console.log('failed')
    } else {
        console.log('finished fetching', res.get('latt_long'))
    }
    console.log('ab')
}
// test()

module.exports = {
    insertItemBulk,
    getRecentData
}