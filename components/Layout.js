import 'semantic-ui-css/semantic.min.css'
import React, { useState } from 'react';
import { Menu, Container } from 'semantic-ui-react'
import Head from 'next/head'

// function handleItemClick = (e, { name }) => this.setState({ activeItem: name })

const Layout = (props) => {
	const [activeItem, setActive] = useState('seasons')

	return (
		<div>
			<Head>
				<title>Sonarr Eps.</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
			</Head>
			<header>
				<Menu stackable>
				    <Menu.Item>
				     	<img src='/static/jakeface.png' />
				    </Menu.Item>
					<Menu.Item header>Sonarr.Eps.</Menu.Item>
					<Menu.Item
						name='seasons'
						active={activeItem === 'seasons'}
						onClick={() => setActive('seasons')}
					/>
					<Menu.Item
						name='episodes'
						active={activeItem === 'episodes'}
						onClick={() => setActive('episodes')}
					/>
				</Menu>     
			</header>
			<Container>
			{props.children}      
			</Container>
			<footer className="footer">
				<div className="content has-text-centered">
					<span>I'm the footer</span>
				</div>
				</footer>
		</div>
)}

export default Layout