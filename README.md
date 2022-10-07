###### tags: `ithome` `ironman`
# Day 22 - Direction (1)：基礎操作

昨天介紹了該如何呼叫 Direction 這支 API，我們今天就拿官網給的範例教學練練手～

📌 先說明一下我們要做的東西：
載入地圖後會有個藍色的點，這個點是我們初始化設定的原點，透過點擊地圖會出現一個紅色的點，這是我們所決定的終點，根據起點和終點去規劃一條自行車路線，並附上路段指示，大概來說就是這樣，來看看該怎麼用 Direction API 完成這一系列的操作吧！

## 1. 設定起點
在初始化地圖時，就先設好起始點：
```jsx=
constructor(props) {
  super(props);
  this.state = {
    start: [-122.662323, 45.523751]
  };
  this.mapContainer = React.createRef();
}

componentDidMount() {
  const { start } = this.state;
  const map = new mapboxgl.Map ({
    container: this.mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: start,
    zoom: 12
  });
}
```
## 2. 路線請求
我們寫一個 `getRoute` 的 Function 來發出 API 請求，並將獲得的資料繪製成路線圖 (Line Layer)；在我們每次點擊地圖上的點時，就會呼叫一次 Direction API 以及更新 Layer：

```jsx=
async getRoute(map, end) {
  const { start } = this.state
  const query = await fetch(
  `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
  // 如果 'route' 已經存在，重設置它的 data 就好
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

- `getSource`：回傳地圖樣式中，具有指定 ID 的 Source
    - `setData`：設置 GeoJSON 檔案並重新渲染地圖

> 呼叫 API 時，回傳的資料：

![](https://i.imgur.com/Erkmo5x.png)


## 3. 加入目的地
有了起點，現在來處理終點吧～
我們要讓使用者靠點擊地圖來決定終點位置，所以這邊要加上地圖的點擊事件，並在獲得終點的經緯度後呼叫 `getRoute` 獲得新的路線資訊：

```jsx=
map.on('click', (event) => {
  // 將回傳的經緯度資訊調整成 GeoJSON 接受的格式
  const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
  const end = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      }
    ]
  };

  // 如果 'end' 已經存在，重設置它的 data 就好
  if (map.getLayer('end')) {
    map.getSource('end').setData(end);
  } else {
    map.addLayer({
      id: 'end',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': '#f30'
      }
    });
  }
  this.getRoute(map, coords);
});
```

到這邊，只要點擊地圖就會產生終點及地圖所規劃的路線嘍～

## 4. 添加轉彎指示
最後！我們來幫這張地圖加上轉彎資訊吧！
這部分的資訊其實也是藏在 Direction API 所回傳的資訊內：

![](https://i.imgur.com/vv6NZpo.png)

先給轉彎指示一個區塊：
```jsx=
render() {
  return (
    <div>
      <div ref={this.mapContainer} className="map-container" />
      <div id="instructions"></div>
    </div>
  );
}
```

> instructions 的 css 設置：

```css=
#instructions {
  position: absolute;
  margin: 20px;
  width: 20%;
  top: 0;
  padding: 20px;
  background-color: #fff;
  opacity: 0.8;
}
```

接下來我們把 API 裡每個點的路線指示抓出來就可以了，因為會是隨著 API 更新而有所不同，所以直接寫在 `getRoute` 這個 Function 內：
```jsx=
const instructions = document.getElementById('instructions');
const steps = data.legs[0].steps;

let tripInstructions = '';
for (const step of steps) {
  tripInstructions += `<li>${step.maneuver.instruction}</li>`;
}
instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
  data.duration / 60
)} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
```

到這邊就完成啦～

> 輸出地圖：

![](https://i.imgur.com/dTVlHYz.png)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Direction_basic)


看完這篇，關於 Direction API 的基礎操作應該是都懂個八成了，要做一些延伸應用也沒問題～
明天來寫一個小 Demo，但主題我還沒想好 XD
所以下一篇公布，ㄅㄅ！


## Reference 
- [Getting started with the Mapbox Directions API](https://docs.mapbox.com/help/tutorials/getting-started-directions-api/)
- [getSource｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getsource)
- [setData｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource#setdata)
