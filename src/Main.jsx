import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'
const allLoc = [
  {
    "name": "Taiwan",
    "coordinates": [121, 23.5]
  }, 
  {
    "name": "Japan",
    "coordinates": [136.88464720797114, 35.19787221331142]
  },
  {
    "name": "Los Angeles",
    "coordinates": [-118.2436849000, 34.0522342000]
  },
  {
    "name": "London",
    "coordinates": [1.1743, 52.3555]
  },
  {
    "name": "Russia",
    "coordinates": [37.5, 55.5]
  },
  {
    "name": "Sri Lanka",
    "coordinates": [80.45, 7.57]
  },
]

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 60,
      lat: 20,
      zoom: 1.5,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe'
    });

    map.on('style.load', () => {
      map.setFog({});
    })

    // Single Marker
    // const el = document.createElement('div');
    //   el.className = 'marker';
    //   const size = 80;
    //   el.style.width = `${size}px`;
    //   el.style.height = `${size}px`;

    // new mapboxgl.Marker({
    //   element: el,
    //   rotationAlignment: 'horizon',
    //   offset: [0, -size / 2]
    // })
    //   .setLngLat([121, 23.5])
    //   .setPopup(new mapboxgl.Popup({ offset: 25 })
    //     .setHTML(`<h1>Taiwan</h1>`)
    //   )
    //   .addTo(map);

    // lots of Markers
    for (const loc of allLoc) {
      const el = document.createElement('div');
      el.className = 'marker';
      const size = 80;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      new mapboxgl.Marker({
        element: el,
        rotationAlignment: 'horizon',
        offset: [0, -size / 2]
      })
        .setLngLat(loc.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h1>${loc.name}</h1>`)
        )
        .addTo(map);
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

