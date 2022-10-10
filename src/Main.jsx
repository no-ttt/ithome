import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'
const secondsPerRevolution = 100;

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.5,
      lat: 23.5,
      zoom: 1.5,
      userInteracting: false,
      spinEnabled: true,
      map: null
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe',
    });

    this.setState({ map: map })

    map.on('style.load', () => {
      map.setFog({});
    });

    map.on('mousedown', () => {
      this.setState({ userInteracting: true })
    });

    map.on('mouseup', () => {
      this.setState({ userInteracting: false })
      this.spinGlobe(map);
    });

    map.on('moveend', () => {
      this.spinGlobe(map);
    });

    this.spinGlobe(map);
  }

  spinGlobe = (map) => {
    const { userInteracting, spinEnabled } = this.state

    if (spinEnabled && !userInteracting) {
      let distancePerSecond = 360 / secondsPerRevolution;
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}
