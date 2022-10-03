import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import output from './output.json'

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.2,
      lat: 23.2,
      zoom: 8,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount = async () =>  {
    const { lng, lat, zoom } = this.state;
    
    // init map
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    })

    map.on('load', () => {
      map.addSource('restaurant', {
        type: 'geojson',
        data: output,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 80
      });
       
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'restaurant',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            250,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });
       
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'restaurant',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
       
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'restaurant',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': 'red',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
       
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('restaurant').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;
        
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
         }
        );
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