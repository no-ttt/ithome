import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import taipei from './img/Taipei.jpeg'
import kaohsiung from './img/Kaohsiung.jpeg'
import taitung from './img/Taitung.jpeg'
import taichung from './img/Taichung.jpeg'
import hualien from './img/Hualien.jpeg'

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
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom
    });

    // map.on('load', () => {
    //   map.loadImage(
    //     'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',   // your image
    //     (error, image) => {
    //       if (error) throw error;
         
    //       map.addImage('cat', image);

    //       map.addSource('point', {
    //         'type': 'geojson',
    //         'data': {
    //           'type': 'FeatureCollection',
    //           'features': [
    //             {
    //               'type': 'Feature',
    //               'geometry': {
    //                 'type': 'Point',
    //                 'coordinates': [121, 23.5]
    //               }
    //             }
    //           ]
    //         }
    //       });
    
    //       map.addLayer({
    //         'id': 'point',
    //         'type': 'symbol',
    //         'source': 'point',
    //         'layout': {
    //           'icon-image': 'cat',
    //           'icon-size': 0.25
    //         }
    //       });
    //     }
    //   )
    // })

    map.on('load', () => {
      this.addImage(map, taipei, "taipei", [121.5616, 25.0335], 0.1)
      this.addImage(map, kaohsiung, "kaohsiung", [120.2710, 22.6499], 0.1)
      this.addImage(map, taitung, "taitung", [121.1129, 22.9202], 0.08)
      this.addImage(map, taichung, "taichung", [120.7266, 24.3351], 0.06)
      this.addImage(map, hualien, "hualien", [121.4520, 24.2008], 0.08)
    })
  }
  
  addImage = (map, img, name, center, size) => {
    map.loadImage(
      img,
      (error, image) => {
      if (error) throw error;
       
      map.addImage(name, image);

      map.addSource(name, {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': center
              }
            }
          ]
        }
      });

      map.addLayer({
        'id': name,
        'type': 'symbol',
        'source': name, // reference the data source
        'layout': {
          'icon-image': name, // reference the image
          'icon-size': size
        }
      });
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