import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoibm91c2VydXNlIiwiYSI6ImNsODR2dnJydTAxNXYzdnBzZWUwdWZkY3QifQ.TiXa2TtlGjSLY2gXNphj-w'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 90,
      lat: 0,
      zoom: 2,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      // style: 'mapbox://styles/mapbox/satellite-v9',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe'
    });

    map.on('style.load', () => {
      map.setFog({}); // enable atmosphere and stars
      });

    const el = document.createElement('div');
    el.className = 'marker';
    const size = 80;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;

    const popup = new mapboxgl.Popup({ offset: 25 });
    popup.setHTML(`<h1>Taiwan is Here!</h1>`);

    new mapboxgl.Marker({
      element: el,
      // Point markers toward the nearest horizon
      rotationAlignment: 'horizon',
      offset: [0, -size / 2]
      })
      .setLngLat([121, 23.5])
      .setPopup(popup)
      .addTo(map);

    // new mapboxgl.Popup({
    //   closeOnMove: true
    // })
    //   .setLngLat([121, 23.5])
    //   .setHTML(`<h1>Taiwan is Here!</h1>`)
    //   .addTo(map);
    
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
