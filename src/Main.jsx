import React, { Component } from "react"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      map: null,
      data: [],
      name: "",
      des: "",
      lat: "",
      lng: "",
      img: "",
      waypoint: "",
      traffic: "driving"
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const map = new mapboxgl.Map ({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [120.5, 23.5],
      zoom: 7
    });

    this.setState({ map: map })
  }

  async getRoute(waypoint, traffic) {
    const { map } = this.state
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${traffic}/${waypoint}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    }
    else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
  }

  submit = () => {
    const { map, data, name, des, lat, lng, img, waypoint, traffic } = this.state
    const newData = {
      name: name,
      des: des,
      lat: lat,
      lng: lng,
      img: img
    }

    let newWaypoint = ""
    if (waypoint !== "") {
      newWaypoint = waypoint + ';' + lng.toString() + ',' + lat.toString()
      this.getRoute(newWaypoint, traffic)
      new mapboxgl.Marker({
        color: "red"
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<div>${name}</div>`))
        .addTo(map)
    }
    else {
      newWaypoint = lng.toString() + ',' + lat.toString()
      new mapboxgl.Marker({
        color: "red"
      })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<div>${name}</div>`))
      .addTo(map)
    }
    
    this.setState({
      data: [...data, newData],
      open: false, 
      name: "",
      des: "",
      lat: "",
      lng: "",
      img: "",
      waypoint: newWaypoint
    })
  }

  render() {
    const { open, data, traffic, waypoint } = this.state
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
        <div id="content">
          <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: 280, height: 30, padding: "10px", marginBottom: "15px" }}>
            <div>交通工具</div>
            <Select value={traffic} size="small" 
              onChange={(e) => { this.setState({ traffic: e.target.value }); this.getRoute(waypoint, e.target.value) }}
            >
              <MenuItem value="driving-traffic">driving-traffic</MenuItem>
              <MenuItem value="driving">driving</MenuItem>
              <MenuItem value="walking">walking</MenuItem>
              <MenuItem value="cycling">cycling</MenuItem>
            </Select>
          </Card>
          {
            data.map((d, i) => (
              <Card key={i} sx={{ display: 'flex', justifyContent: 'space-between', width: 300, height: 100, marginBottom: "15px" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography component="div" variant="h6">{d.name}</Typography>
                    <Typography variant="subtitle" color="text.secondary" component="p">{d.des}</Typography>
                  </CardContent>
                </Box>
                <CardMedia component="img" sx={{ width: 100, height: 100 }} image={d.img} />
              </Card>
            ))
          }
          <button className="icon-btn" onClick={() => this.setState({ open: true })}><AddIcon /></button>
          <Dialog onClose={() => this.setState({ open: false })} open={open}>
            <DialogTitle>輸入你要加入的景點資訊</DialogTitle>
            <div style={{ padding: "20px" }}>
              <div className="input-info">
                <span>景點名稱</span>
                <TextField id="name" label="name" variant="outlined" size="small" 
                  onChange={(e) => this.setState({ name: e.target.value })} 
                />
              </div>
              <div className="input-info">
                <span>備註</span>
                <TextField id="des" label="des" variant="outlined" size="small" 
                  onChange={(e) => this.setState({ des: e.target.value })} 
                />
              </div>
              <div className="input-info">
                <span>經度</span>
                <TextField id="longitude" label="longitude" variant="outlined" size="small" 
                  onChange={(e) => this.setState({ lng: e.target.value })} 
                />
              </div>
              <div className="input-info">
                <span>緯度</span>
                <TextField id="latitude" label="latitude" variant="outlined" size="small" 
                  onChange={(e) => this.setState({ lat: e.target.value })} 
                />
              </div>
              <div className="input-info">
                <span>景點照片</span>
                <TextField id="img" label="img" variant="outlined" size="small" 
                  onChange={(e) => this.setState({ img: e.target.value })} 
                />
              </div>
              <button className="add-btn" onClick={this.submit}>Add</button>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}