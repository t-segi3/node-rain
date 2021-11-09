

const processResponse = async (response) => {

    var newItems = []

    for (var i=0; i<response.consolidated_weather.length; i++) {
        const tmp = response.consolidated_weather[i]
        newItems.push({
            title: response.title,
            location_type: response.location_type,
            woeid: response.woeid,
            latt_long: response.latt_long,
            timezone: response.timezone,
            applicable_date: tmp.applicable_date,
            consolidated_weather: {
                id: tmp.id,
                weather_state_name: tmp.weather_state_name,
                weather_state_abbr: tmp.weather_state_abbr,
                wind_direction_compass: tmp.wind_direction_compass,
                created: tmp.created,
                applicable_date: tmp.applicable_date,
                min_temp: tmp.min_temp,
                max_temp: tmp.max_temp,
                the_temp: tmp.the_temp,
                wind_speed: tmp.wind_speed,
                wind_direction: tmp.wind_direction,
                air_pressure: tmp.air_pressure,
                humidity: tmp.humidity,
                visibility: tmp.visibility,
                predictability: tmp.predictability
            }
        })
    }
    
    return newItems
}

module.exports = {
    processResponse
}