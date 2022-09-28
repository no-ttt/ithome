import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoibm91c2VydXNlIiwiYSI6ImNsODR2dnJydTAxNXYzdnBzZWUwdWZkY3QifQ.TiXa2TtlGjSLY2gXNphj-w'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activeChapter: "",
    };
    this.mapContainer = React.createRef();
    this.setActiveChapter = this.setActiveChapter.bind(this);
    this.isElementOnScreen = this.isElementOnScreen.bind(this);
  }

  componentDidMount = async () =>  {
    // call api
    const data = await fetch('https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/Taichung?%24top=20&%24format=JSON').then(response => response.json());
    
    this.setState({
      data: data,
      activeChapter: data[0].RestaurantID
    })
    
    // init map
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [data[0].Position.PositionLon, data[0].Position.PositionLat],
      zoom: 15,
      bearing: 27,
      pitch: 45
    })

    data.map((d) => (
      new mapboxgl.Marker({
        scale: 0.8,
        color: "red"
      })
      .setLngLat([d.Position.PositionLon, d.Position.PositionLat])
      .addTo(map)
    ))

    window.onscroll = () => {
      for (let i = 0; i < data.length; i++) {
        if (this.isElementOnScreen(data[i].RestaurantID)) {
          this.setActiveChapter(data[i].RestaurantID, map, data[i].Position.PositionLon, data[i].Position.PositionLat);
          break;
        }
      }
    };
  }

  setActiveChapter = (chapterID, map, Lon, Lat) => {
    const { activeChapter } = this.state

    if (chapterID === activeChapter) return;

    map.flyTo({
      center: [Lon, Lat],
      zoom: 18
    })

    document.getElementById(chapterID).classList.add('active');
    document.getElementById(activeChapter).classList.remove('active');

    this.setState({
      activeChapter: chapterID
    })
  }

  isElementOnScreen = (id) => {
    const element = document.getElementById(id);
    const bounds = element.getBoundingClientRect();

    return bounds.top < window.innerHeight && bounds.bottom > 0;
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
        <div id="features">
          {
            data.map((d, i) => (
              <section key={i} id={d.RestaurantID} className={ i === 0 ? "active": "" }>
                <h3>{d.RestaurantName}</h3>
                <div className="res-detail-intro">
                  <div>
                    <div className="res-detail-txt">營業時間：{d.OpenTime}</div>
                    <div className="res-detail-txt">地址：{d.Address}</div>
                    <div className="res-detail-txt">電話：{d.Phone}</div>
                  </div>
                </div>
              </section>
            ))
          }
          <section style={{ paddingBottom: "500px"}} />
        </div>
      </div>
    );
  }
}