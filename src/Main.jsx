import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

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

    const marker = new mapboxgl.Marker({
      color: "pink",
      draggable: true,
    })
      .setLngLat([121, 23.5])
      .addTo(map);

    marker.on('dragend', () => {
      alert(`You put me down at: 
          Longitude: ${marker.getLngLat().lng} 
          Latitude: ${marker.getLngLat().lat}`
      );
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
