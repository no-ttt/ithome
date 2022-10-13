import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      lng: 120,
      lat: 23.5,
      zoom: 1.5,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe'
    });

    map.on('style.load', () => {
      map.setFog({});
    })

    map.on('load', () => {
      map.addSource('bathymetry', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-bathymetry-v2'
      });
      
      map.addLayer({
        'id': 'water-depth',
        'type': 'fill',
        'source': 'bathymetry',
        'source-layer': 'depth',
        'layout': {},
        'paint': {
          'fill-color': [
            'interpolate',
            ['cubic-bezier', 0, 0.5, 1, 0.5],
            ['get', 'min_depth'],
            200,
            '#78bced',
            9000,
            '#15659f'
          ]
        }
      }, 'hillshade');
    })
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}

