import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import output from './output.json'

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.2,
      lat: 23.2,
      zoom: 9,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount = async () =>  {
    const { lng, lat, zoom } = this.state;
    
    // init map
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    })

    map.on('load', () => {
      map.addSource('restaurant', {
        type: 'geojson',
        data: output
      });
       
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'restaurant',
        paint: {
          'circle-color': 'red',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
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