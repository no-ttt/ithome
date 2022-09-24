import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoibm91c2VydXNlIiwiYSI6ImNsODR2dnJydTAxNXYzdnBzZWUwdWZkY3QifQ.TiXa2TtlGjSLY2gXNphj-w'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120,
      lat: 23.5,
      zoom: 7,
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

    let count = 0;
    map.on('idle', () => {
      console.log('A idle event occurred.');
      count > 0 &&
      new mapboxgl.Popup({
        closeOnMove: true
      })
        .setLngLat([121, 23.5])
        .setHTML(`<h1>count: ${count}</h1>`)
        .addTo(map);
      count += 1;
    });
    
    map.on('error', () => {
      alert('A error event occurred.');
    });
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}