const axios = require('axios')

const url = "http://samthedeer.noip.me:9876/api/"
const apiKey = "apikey=b882102a13324545ac31032003f17fe1"

module.exports.getFilesBySeason = async (seriesID, seasonID) => {
	const fun_url = `${url}episodefile?seriesId=${seriesID}&${apiKey}`

	const r = await axios.get(fun_url)
	const seriesEpisodeArray = r.data
	const seasonEpisodeArray = seriesEpisodeArray.filter(i => i.seasonNumber === parseInt(seasonID, 10))

	return seasonEpisodeArray
}

module.exports.deleteEpisode = async (id) => {
	const funURL = `${url}episodefile/${id}?${apiKey}`
	const res = await axios.delete(funURL)
	
	return res
} 

module.exports.setUnmonitoredSeries = async function (seriesID) {
	const fun_url = `${url}series/${seriesID}?${apiKey}`
	
	let r = await axios.get(fun_url)
	const series = r.data
	
	if (series.monitored === false) {
		return 204
	}
	
	series.monitored = false
	
	r = await axios.put(fun_url,JSON.stringify(series))
	return r 
}

module.exports.setMonitoredSeries = async function (seriesID) {
	const fun_url = `${url}series/${seriesID}?${apiKey}`
	
	let r = await axios.get(fun_url)
	const series = r.data
	
	if (series.monitored === true) {
		return 204
	}
	
	series.monitored = true
	
	r = await axios.put(fun_url,JSON.stringify(series))
	return r 
}

module.exports.setUnmonitoredSeason = async function (seriesID, seasonID) {
	const fun_url = `${url}series/${seriesID}?${apiKey}`
	
	let r = await axios.get(fun_url)
	const series = {...r.	data}
	const season = series.seasons.find(i => i.seasonNumber === parseInt(seasonID, 10))

	if (season.monitored === false) {
		return 204
	}
	
	season.monitored = false

	try {
		r = await axios.put(fun_url, JSON.stringify(series))
		return r 
	} catch(err) {
		console.log(err)
		return None
	}
}

module.exports.setMonitoredSeason = async function (seriesID, seasonID) {
	const fun_url = `${url}series/${seriesID}?${apiKey}`
	
	let r = await axios.get(fun_url)
	const series = r.data

	const season = series.seasons.find(i => i.seasonNumber === parseInt(seasonID, 10))

	if (season.monitored === true) {
		return 204
	}
	
	season.monitored = true

	try {
		r = await axios.put(fun_url, JSON.stringify(series))
		return r 
	} catch(err) {
		console.log(err)
		return None
	}
}