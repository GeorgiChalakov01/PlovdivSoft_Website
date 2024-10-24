import React, { useEffect, useState } from 'react'


function App() {
	const [phrases, setBackendData] = useState([{}])
	const queryParameters = new URLSearchParams(window.location.search)

	
	var language = queryParameters.get("language");

	useEffect(() => {
		fetch(`/api?language=${language}`)
			.then(response => response.json())
			.then(data => {
				const phraseDictionary = data.reduce((acc, current) => {
					acc[current.key] = current.value;
					return acc;
				}, {});

				setBackendData(phraseDictionary);
		});
	}, [language])

	return (
		<div>

			{(typeof phrases === 'undefined') ? (
				<p>Loading...</p>
			) : (
				<p>{phrases.title}</p>
			)}

		</div>
	)
}

export default App;
