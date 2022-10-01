import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Taiwan from "./Taiwan.json"

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

const city = ["宜蘭縣", "新北市", "臺北市", "基隆市", "桃園市", "新竹縣", "新竹市", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣", "臺東縣", "花蓮縣"]
const color = ["#FC6300", "#FC6300", "#FC6300", "#FC6300", "#FAC670", "#FAC670", "#FAC670", "#FAC670", "#008481", "#008481", "#008481", "#BEA8E6", "#BEA8E6" , "#BEA8E6", "#BEA8E6", "#FCA175", "#FCA175", "#91C3CE", "#91C3CE"]

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


    map.on('load', () => {      
      map.addSource('Taiwan', {
        'type': 'geojson',
        'data': Taiwan
      });

      map.addLayer({
        'id': 'taiwanLayer',
        'type': 'line',
        'source': 'Taiwan',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round',
        },
        'paint': {
          'line-color': '#888',
          'line-width': 2,
        }
      });

      // map.addLayer({
      //   'id': 'fill-layer',
      //   'type': 'fill',
      //   'source': 'Taiwan',
      //   'paint': {
      //     'fill-color': 'red',
      //     'fill-opacity': 0.5
      //   }
      // });

      // 南投縣區塊
      // map.addLayer({
      //   'id': '南投縣',
      //   'type': 'fill',
      //   'source': 'Taiwan',
      //   'paint': {
      //     'fill-color': 'red',
      //     'fill-opacity': 0.5
      //   },
      //   filter: ['==', 'COUNTYNAME', '南投縣']
      // });


      city.forEach((c, i) => {
        this.addBlock (map, c, color[i])
      })
      
    });
  }

  addBlock = (map, name, color) => {
    map.addLayer({
      'id': name,
      'type': 'fill',
      'source': 'Taiwan',
      'paint': {
        'fill-color': color,
        'fill-opacity': 0.5
      },
      filter: ['==', 'COUNTYNAME', name]
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