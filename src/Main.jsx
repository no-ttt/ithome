import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 120.3,
      lat: 23.2,
      zoom: 10,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount = async () =>  {
    // call api
    const data = await fetch('https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/Tainan?%24format=JSON').then(response => response.json());
    console.log(data)
    const { lng, lat, zoom } = this.state;
    

    // init map
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    })
      .addControl(new mapboxgl.AttributionControl({
        customAttribution: 'My food map'
      }));


    // add marker
    data.map((d) => (
      new mapboxgl.Marker({
        scale: 0.8,
        color: "red"
      })
      .setLngLat([d.Position.PositionLon, d.Position.PositionLat])
      .setPopup(new mapboxgl.Popup({  // add restaurant detail
        maxWidth: "500px"
      }).setHTML(`
        <div class="res-detail-intro">
          <img class="res-pic" src=${d.Picture.PictureUrl1 || "https://www.bomb01.com/upload/news/original/c95e0d21eda50ebc16d5f8ef568f60a7.png"} />
          <div>
            <div class="res-title-txt">${d.RestaurantName}</div>
            <div class="res-detail-txt">營業時間：${d.OpenTime}</div>
            <div class="res-detail-txt">地址：${d.Address}</div>
            <div class="res-detail-txt">電話：${d.Phone}</div>
        </div>
        <div>
      `))
      .addTo(map)
    ))


    // add control
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
  }

  render() {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}
