import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.6717952160162,
      lat: 24.16853028577123,
      zoom: 18,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      bearing: 12,
      pitch: 60, 
      interactive: false
    });

    // pixels the map pans when the up or down arrow is clicked
    const deltaDistance = 100;
 
    // degrees the map rotates when the left or right arrow is clicked
    const deltaDegrees = 25;  

    map.on('load', () => {
      map.getCanvas().focus();
       
      map.getCanvas().addEventListener(
        'keydown',
        (e) => {
          e.preventDefault();
          if (e.which === 38)                         // up
            map.panBy([0, -deltaDistance])
          else if (e.which === 40)                    // down
            map.panBy([0, deltaDistance])
          else if (e.which === 37)                    // left
            map.easeTo({
              bearing: map.getBearing() - deltaDegrees,
            })
          else if (e.which === 39)                    // right
            map.easeTo({
              bearing: map.getBearing() + deltaDegrees,
            })
        },  
        true
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