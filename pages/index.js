import 'semantic-ui-css/semantic.min.css'
import React, { useState } from 'react'
import { Menu, Checkbox, List, Accordion, Icon, Button } from 'semantic-ui-react'
import fetch from 'isomorphic-unfetch'
import Layout from '../components/Layout'

function seasonChanged(seasonID) {
	// body...
}

function seriesChanged(seriesID) {
	// body...
}

function removeFromIndexArray(item, indexArray) {
	return indexArray.filter(i => i !== item)
}

const Index = (props) => {
	const [indexArray, setIndexArray] = useState(props.shows.map(show => show.id))
	// console.log(props.shows)

	// function showHideAll() {
	// 	if (indexArray.length === 0) {
	// 		const newIndexArray = props.shows.map(show => show.id)
	// 		setIndexArray(newIndexArray)
	// 	} else {
	// 		setIndexArray([])
	// 	}
	// }


  return (
  	<Layout>
  		<Button onClick={() => setIndexArray([])}>
  			Collapse/Show All
  		</Button>
			<Accordion styled exclusive={false} fluid>
				<Accordion.Title 
					active
					index={0}
				>
					<Icon name='dropdown' />
					<Checkbox label="1" defaultChecked />
				</Accordion.Title>
	  		<Accordion.Content active>
	  		</Accordion.Content>
			</Accordion>

  		{props.shows.map(show => (
	  		<Accordion styled exclusive={false} fluid>
		  		<Accordion.Title 
		  			active={indexArray.includes(show.id)} 
		  			index={show.id}
	  			>
		  			<Icon name='dropdown' />
		  			<Checkbox label={show.title} defaultChecked={show.monitored} />
		  		</Accordion.Title>
		  		<Accordion.Content active={indexArray.includes(show.id)}>
		  			<List>
		  				{show.seasons.map(season => (
		  					<List.Item>
		  						<Checkbox label={"Season " + season.seasonNumber} defaultChecked={season.monitored} />
		  					</List.Item>
	  					))}
		  			</List>
		  		</Accordion.Content>
				</Accordion>	
			))}
  	</Layout>
  )
}

Index.getInitialProps = async function() {
	const url = "http://samthedeer.noip.me:9876/api/"
	const apiKey = "apikey=b882102a13324545ac31032003f17fe1"
  const res = await fetch(url + 'series?' + apiKey)
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)
  return {
    shows: data
  }
}

export default Index