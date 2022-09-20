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
    // const map = new mapboxgl.Map ({
    //   container: this.mapContainer.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [lng, lat],
    //   zoom: zoom
    // });

    // AttributionControl
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false, 
    })
      .addControl(new mapboxgl.AttributionControl({
        customAttribution: 'Map design by me'
      }));


    // FullscreenControl
    map.addControl(new mapboxgl.FullscreenControl());


    //  GeolocateControl
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
    }));

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}