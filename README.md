###### tags: `ithome` `ironman`
# Day 24 - 簡易版行程規劃地圖

想了兩天，我們來做一張可以進行行程規劃的地圖好了！
不過是簡易版的啦，細節上的設定可以依據需求再去做更改～

## 需求目標
老樣子，在進入實作前先訂一下我們的需求：
- 選擇交通工具
- 新增景點以及標上 Marker
- 景點之間的路線
- 簡單的景點相關資訊

大概就這樣吧！畢竟是簡易版，不要太苛刻 XD

## Material UI
先說一下！因為我懶得自己刻 Component 然後又不想要 Demo 長得太醜，所以有用到 [Material UI](https://mui.com/zh/material-ui/getting-started/overview/) 這個套件！安裝如下：

```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/material @mui/styled-engine-sc styled-components
```

## 行程規劃地圖
> 前提注意：這邊主要講 Mapbox 的部分，所以程式碼我有簡化掉，完整版我有放到 Github～

進入正題！

### 1. 地圖初始化
```jsx=
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
```

來解釋一下這些值的工作是什麼：
- `open`：控制彈跳窗做使用
- `map`：初始化的地圖
- `data`：最後一個新增的景點資訊
    - `name`：景點名稱
    - `des`：景點描述
    - `lat` / `lng`：緯度 / 經度
    - `img`：景點圖片
- `waypoint`：目前所新增的所有景點
- `traffic`：交通工具

### 2. 新增景點
之前我們介紹 API 的時候，只有說到在 `coordinates` 可以放入起點跟終點，但其實可以放不只 2 個景點坐標喔～但還是有上限啦，最多只能放 25 個座標 (包含起點跟終點)。

```jsx=
submit = () => {
  const { map, waypoint, traffic } = this.state

 ...

  let newWaypoint = ""
  if (waypoint !== "") {  // 新加入的點不是起點的情況
    // 加入新的景點坐標
    newWaypoint = waypoint + ';' + lng.toString() + ',' + lat.toString()
    
    // 重新呼叫 API
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
    open: false, 
    waypoint: newWaypoint,
    ...
  })
}
```

`waypoint` 這個字串是 Direction API 的部分字串 (關於串接所有景點的 part)，
那字串處理的部分很簡單，我們在每個坐標之間 (`{longitude},{latitude}`) 用 `;` 做區隔做字串連接就可以了，處理好再丟到 `getRoute` 去重新呼叫 API；那在新增點的同時，為了更好的可以看到位置，我們用 `Marker` 在地圖上做標示，使用上也有做彈跳窗設定，點擊 Marker 就可以看到所代表的景點名稱了～

其實還有更好的作法，但我們主題是簡化嘛 (⁎⁍̴̛ᴗ⁍̴̛⁎)

### 3. 路線請求
剛剛從 `submit` 收到處理好的字串了，拿來用吧！

```jsx=
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
```

`traffic` 這個參數也是一樣的意思，如果我們換了個交通工具，那路線也是得重新規劃，所以也要重新呼叫這支 API～

所以在如果你選了其它交通工具，觸發事件時就得再叫一次這個 Function：

```jsx=
<Select value={traffic} size="small" 
  onChange={(e) => { this.setState({ traffic: e.target.value }); this.getRoute(waypoint, e.target.value) }}
>
  <MenuItem value="driving-traffic">driving-traffic</MenuItem>
  <MenuItem value="driving">driving</MenuItem>
  <MenuItem value="walking">walking</MenuItem>
  <MenuItem value="cycling">cycling</MenuItem>
</Select>
```

完成！

> 點擊「＋」新增景點資訊：

![](https://i.imgur.com/Z5k3zII.png)

> 新增 1 個以上的景點後，就會呈現路線：

![](https://i.imgur.com/wTG1fuM.png)

也可以切換不同的交通工具喔～

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Direction_application)


那我們介紹 API 的部分就差不多告一個段落啦～ (撒花)
一路下來我也是不容易啊 ... ༼இɷஇ༽

剩下的這幾天我決定來分享一些我在查資料的時候發現覺得很酷的東西！
當然還是跟 Mapbox 脫不了關係啦哈 XD

看完你一定會更愛 Mapbox 這個酷東西！(不要亂立 Flag)

## Reference
- [Material UI](https://mui.com/zh/material-ui/getting-started/overview/)
- [Direction API｜Mapbox](https://docs.mapbox.com/api/navigation/directions/#required-parameters)
