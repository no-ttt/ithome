import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import traffic from './traffic.json'

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.2,
      lat: 23.5,
      zoom: 7,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount = async () =>  {
    const { lng, lat, zoom } = this.state;
    
    // init map
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
    })

    map.on('load', () => {
      map.addSource('traffic', {
        'type': 'geojson',
        'data': traffic
      });
       
      map.addLayer({
        'id': 'traffic-heat',
        'type': 'heatmap',
        'source': 'traffic',
        'maxzoom': 15,
        'paint': {
          // use sequential color palette to use exponentially as the weight increases
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(236,222,239,0)',
            0.2,
            'rgb(208,209,230)',
            0.4,
            'rgb(166,189,219)',
            0.6,
            'rgb(103,169,207)',
            0.8,
            'rgb(28,144,153)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            'stops': [
              [11, 15],
              [15, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            'default': 1,
            'stops': [
              [14, 1],
              [15, 0]
            ]
          }
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