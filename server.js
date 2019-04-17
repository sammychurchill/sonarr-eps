const express = require('express')
const next = require('next')

const sonarr = require('./lib/sonarr.js')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/api/:method/series/:seriesID', async (req, res) => {
      const {method, seriesID} = req.params
      let r
      switch (method) {
        case "setUnmonitored":
          r = await sonarr.setUnmonitoredSeries(seriesID)
          break
        case "setMonitored":
          r = await sonarr.setMonitoredSeries(seriesID)
          break
        default:
          console.log("error")
          return res.json({"status": 500})
      }
      return res.json({"status": r.status})
    })

    server.get('/api/:method/season/:seriesID/:seasonID', async (req, res) => {
      const {method, seriesID, seasonID} = req.params
      let r
      switch (method) {
        case "setUnmonitored":
          try {
            r = await sonarr.setUnmonitoredSeason(seriesID, seasonID)
            // r = await sonarr.deleteFilesBySeason(seriesID, seasonID)
          } catch(err) {
            console.log(err)
            return res.json({"status": 500})
          }
          break

        case "setMonitored":
          try {
            r = await sonarr.setMonitoredSeason(seriesID, seasonID)
          } catch(err) {
            console.log(err)
            return res.json({"status": 500})
          }
          break

        default:
          console.log("error")
          return res.json({"status": 500})
      }

      return res.json({"status": r.status || 200}) // SUPER JANKY!!! cbf
    })

    server.get('/api/seasonepisodes/:seriesID/:seasonID', async (req, res) => {
      const { seriesID, seasonID } = req.params
      const seasonEpisodeArray = await sonarr.getFilesBySeason(seriesID, seasonID)
      return res.json(seasonEpisodeArray)
    })

    server.get('/api/deleteepisode/:id', async(req, res) => {
      const { id } = req.params
      const r = await sonarr.deleteEpisode(id)
      return res.json({"status": r.status})
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })