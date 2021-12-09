require('dotenv').config()
const axios = require('axios')

// get lat long from location name (city)
// TODO : read more @ https://javascript.plainenglish.io/an-introduction-to-geocoding-using-node-js-fe1a5d3aa05c

const nodeGeocoder = require('node-geocoder')
let options = {
    provider: 'openstreetmap'
}

let geoCoder = nodeGeocoder(options)

const _getCoordinateOfLocation = async (city) => {
    try {
        const response = await geoCoder.geocode(city)
        var filtered = []
        for (var i=0; i<response.length; i++) {
            if (response[i].city == null) continue;
            if (response[i].city.toLowerCase().includes(city.toLowerCase())) {
                filtered.push(response[i])
                continue
            }

            if (response[i].formattedAddress == null) continue;
            if (response[i].formattedAddress.toLowerCase().includes(city.toLowerCase())) {
                filtered.push(response[i])
                continue
            }
        }
        // console.log(filtered)

        return filtered
    } catch (err) {
        console.log(err)
    }
}

// search timezone from lat long to
const timezonedbURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=`+process.env.TIMEZONE_DB_KEY+`&format=json`
const _fetchTimeZoneOfCoordinate = async (lat, lng) => {

    try {
        const response = await axios.get(timezonedbURL + `&by=position&lat=`+lat+`&lng=`+lng)
        // console.log(response.data)

        return response.data

    } catch (err) {
        console.log(err)
    }
}

// search woeid from lat long
const metaweatherURL = `https://www.metaweather.com/api/location/search/`
const _fetchWoeidOfCoordinate = async (city, lat, lng) => {
    try {
        const response = await axios.get(metaweatherURL + `?lattlong=`+lat+`,`+lng)

        var filtered = []

        for (var i=0; i<response.data.length; i++) {
            if(response.data[i].title.toLowerCase().includes(city.toLowerCase())) {
                filtered.push(response.data[i])
                continue
            }
        }

        // console.log(filtered)
        
        return filtered

    } catch (err) {
        console.log(err)
    }
}

// final function
const searchByCityName = async (city) => {
    const res1 = await _getCoordinateOfLocation(city)
    // console.log('geocode')
    // console.log(res1[0])
    const tz = await _fetchTimeZoneOfCoordinate(res1[0].latitude, res1[0].longitude)
    // console.log('timezone')
    // console.log(tz)
    const woe = await _fetchWoeidOfCoordinate(city, res1[0].latitude, res1[0].longitude)
    // console.log('woeid')
    // console.log(woe[0])

    console.log('woe length', woe.length)

    // check if woeid exist
    if (woe.length < 1) {
        // console.log('nope')
        return {
            'success': false,
            'message': 'city not found :(',
            'data': {}
        }
    }
    return {
        'success': true,
        'data': {
            'city': res1[0].title,
            'country': tz.countryName,
            'timezone': tz.zoneName,
            'woeid': woe[0].woeid
        }
    }
    
    // console.log('yes')
}

module.exports = {
    searchByCityName
}