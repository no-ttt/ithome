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

    // add popup
    // const popup = new mapboxgl.Popup({
    //   closeButton: false
    // })
    //   .setLngLat([121, 23.5])
    //   .setHTML('<h1>Hello World!</h1>')
    //   .addTo(map);


    // marker add popup
    const marker = new mapboxgl.Marker()
      .setLngLat([121, 23.5])
      .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>")) // add popup
      .addTo(map);

  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}