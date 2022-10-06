import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'
let markers = []

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -122.662323,
      lat: 45.523751,
      zoom: 12,
			map: null,
			start: [-122.662323, 45.523751],
			end: [-122.632282, 45.553088],
			traffic: "driving",
			costTime: 0,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

		this.setState({ map })
  }

	componentDidUpdate(prevProps, prevState) {
		const { map, start, end, traffic } = this.state;
		console.log(start, end, traffic)

		markers.forEach((marker) => marker.remove())

		// Create a DOM element for each marker.
		const el = document.createElement('button');
		// el.innerHTML = "start";
		const width = 20;
		const height = 20;
		el.className = 'marker';
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.backgroundSize = '100%';
	
		// Add markers to the map.
		const marker = new mapboxgl.Marker(el)
			.setLngLat(start)
			.addTo(map);

		const el2 = document.createElement('button');
		// el.innerHTML = "start";
		el2.className = 'marker2';
		el2.style.width = `${width}px`;
		el2.style.height = `${height}px`;
		el2.style.backgroundSize = '100%';

		// // Add markers to the map.
		const marker2 = new mapboxgl.Marker(el2)
			.setLngLat(end)
			.addTo(map);
		
		this.getRoute(map, start, end, traffic)
		markers.push(marker)
		markers.push(marker2)
	}


	async getRoute(map, start, end, traffic) {
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/${traffic}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		
		const json = await query.json()
		const data = json.routes[0]
		const route = data.geometry.coordinates
		const geojson = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates: route
			}
		}

		let index = 0

		if (index === 0) {
			this.setState({
				costTime: Math.floor(data.legs[0].duration / 60)
			})
			index += 1
		}


		// console.log(Math.floor(data.legs[0].duration / 60))

		if (map.getSource('route')) {
			map.getSource('route').setData(geojson);
		}
		else {
			map.addLayer({
				id: 'route',
				type: 'line',
				source: {
					type: 'geojson',
					data: geojson
				},
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#3887be',
					'line-width': 5,
					'line-opacity': 0.75
				}
			});
		}
	}

  render() {
		const { start, end, costTime } = this.state
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
				<div id="instructions">
					<div style={{ marginBottom: "10px" }}>
						<label>Start Position : </label>
						<input type="text" id="start" name="start" value={start} style={{ width: "150px" }}
							onChange={e => { this.setState({ start: [e.target.value.split(",")[0], e.target.value.split(",")[1]] })}} 
							/>
					</div>
					<div style={{ marginBottom: "10px" }}>
						<label>End Position : </label>
						<input type="text" id="end" name="end" value={end} style={{ width: "150px" }}
							onChange={e => { this.setState({ end: [e.target.value.split(",")[0], e.target.value.split(",")[1]] })}} 
						/>
					</div>
					<div style={{ marginBottom: "10px" }}>
						<label>Traffic : </label>
						<select defaultValue="driving" onChange={e => this.setState({ traffic: e.target.value })}>
							<option value="driving">driving</option>
							<option value="walking">walking</option>
							<option value="cycling">cycling</option>
						</select>
					</div>
					<div>
						<span>Spend Time : </span>
						<span>{costTime} mins</span>
					</div>
				</div>
      </div>
    );
  }
}