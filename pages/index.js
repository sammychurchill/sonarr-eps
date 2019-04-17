import 'semantic-ui-css/semantic.min.css'
import React, { useState } from 'react'
import { Menu, 
	Checkbox, 
	List, 
	Accordion, 
	Icon, 
	Button,
	Grid,
	Image
	} from 'semantic-ui-react'
import fetch from 'isomorphic-unfetch'
import Layout from '../components/Layout'
import { toast } from 'react-toastify'

const url = "http://samthedeer.noip.me:9876/api/"
const apiKey = "apikey=b882102a13324545ac31032003f17fe1"

const Index = (props) => {
	const [indexArray, setIndexArray] = useState(props.shows.map(show => show.id))
	const [loading, setLoading] = useState(false)

	function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
	
	function addRemoveItemFromIndexArray(item) {
		const currIndexArray = [...indexArray]

		if (currIndexArray.includes(item)) {
			setIndexArray(currIndexArray.filter(i => i !== item))
		} else {
			currIndexArray.push(item)
			setIndexArray(currIndexArray)
		}
		
	}

	function showHideAll() {
		if (indexArray.length === 0) {
			const newIndexArray = props.shows.map(show => show.id)
			setIndexArray(newIndexArray)
		} else {
			setIndexArray([])
		}
	}

	async function updatedCheckboxSeries(e, seriesID) {
		setLoading(true)
		const parentElementClass = e.target.parentElement.getAttribute("class")
		let method = ""
		if (parentElementClass.includes('checked')) {
			method = "setUnmonitored"
		} else {
			method = "setMonitored"
		}
		const res = await fetch(`/api/${method}/series/${seriesID}`)
		const data = await res.json()

		setLoading(false)
	}

	async function setUnmonitoredSeason(seriesID, seasonID) {
		var episodes = []
		try {
			toast(`Set ${seriesID} - ${seasonID} to unmonitored`, { autoClose: 1500, pauseOnFocusLoss: false, type: toast.TYPE.INFO })
			const res = await fetch(`/api/setUnmonitored/season/${seriesID}/${seasonID}`)
		} catch(err) {
			console.log(err)
			setLoading(false)
			return false
		}

		try {
			const res = await fetch(`/api/seasonepisodes/${seriesID}/${seasonID}`)
			episodes = await res.json()
		} catch(err) {
			console.log(err)
			setLoading(false)
			return false
		}

		try {
			for (let episode of episodes) {
				toast(`Deleting file: ${episode.path}`, { autoClose: 1000, pauseOnFocusLoss: false, type: toast.TYPE.INFO })
				const res = await fetch(`/api/deleteepisode/${episode.id}`)
				await new Promise(r => setTimeout(r, 300))
			}
		} catch(err) {
			console.log(err)
			setLoading(false)
			return false
		}
		setLoading(false)
		return true
	}


	async function setMonitoredSeason(seriesID, seasonID) {
		try {
			toast(`Set ${seriesID} - ${seasonID} to monitored`, { autoClose: 1500 })
			const res = await fetch(`/api/setMonitored/season/${seriesID}/${seasonID}`)
			const data = await res.json()
		} catch(err) {
			console.log(err)
		}
		setLoading(false)
	}

	async function updatedCheckboxSeason(e, seriesID, seasonID) {
		setLoading(true)
		const parentElementClass = e.target.parentElement.getAttribute("class")
		let method = ""
		if (parentElementClass.includes('checked')) {
			setUnmonitoredSeason(seriesID, seasonID)
		} else {
			setMonitoredSeason(seriesID, seasonID)
		}
		
	}

  return (
  	<Layout>
  		<Button onClick={() => showHideAll()}>
  			Collapse/Show All
  		</Button>
  		{props.shows.map(show => (
	  		<Accordion styled exclusive={false} fluid>
		  		<Accordion.Title 
		  			active={indexArray.includes(show.id)} 
		  			index={show.id}
	  			>
		  			<Icon 
		  				name='dropdown' 
		  				onClick={() => addRemoveItemFromIndexArray(show.id)}
		  				/>
		  			<Checkbox 
		  				label={`${show.title} - Size on disk: ${formatBytes(show.sizeOnDisk)}`} 
		  				defaultChecked={show.monitored}
		  				onClick={(e) => updatedCheckboxSeries(e, show.id, null)} 
		  				/>
		  		</Accordion.Title>
		  		<Accordion.Content active={indexArray.includes(show.id)}>
		  			<Grid columns={2} stackable>
							<Grid.Column>
								<List>
				  				{show.seasons.map(season => (
				  					<List.Item>
				  						<Checkbox 
				  							label={"Season " + season.seasonNumber} 
				  							defaultChecked={season.monitored}
							  				onClick={(e) => updatedCheckboxSeason(e, show.id, season.seasonNumber)} 
				  							/>
				  					</List.Item>
			  					))}
				  			</List>
							</Grid.Column>
							<Grid.Column>
								<Image src={`${url}MediaCover/${show.id}/poster.jpg?${apiKey}`} />
							</Grid.Column>
						</Grid>
		  			
		  		</Accordion.Content>
				</Accordion>	
			))}
  	</Layout>
  )
}

Index.getInitialProps = async function() {
  const res = await fetch(url + 'series?' + apiKey)
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)
  return {
    shows: data
  }
}

export default Index