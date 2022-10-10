###### tags: `ithome` `ironman`
# Day 25 - 一些很酷的 Mapbox Styles～(1)

我們常見以及常用的地圖大多都是 2D 的，所以在分享這邊我們做 3D 地圖吧！
今天就來看一下一顆簡單的旋轉地球我們要怎麼做～

說是簡單，但看到的當下還是不禁讚嘆好酷哈哈哈 (╯✧∇✧)╯

## 3D 地球設置
### 1. 地圖初始化
```jsx=
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
}
```
- constructor 設定
    - `userInteracting`：使用者是否在與地圖做互動
    - `spinEnabled`：地圖是否轉動
- init Map：衛星圖樣式
    - `style: 'mapbox://styles/mapbox/satellite-v9'`
    - `projection: 'globe'`

### 2. 載入樣式
```jsx=
map.on('style.load', () => {
  map.setFog({});
});
```

- `setFog` 載入外太空背景

### 3. 旋轉地球
讓地球旋轉的 Function：

```jsx=
const secondsPerRevolution = 120;
spinGlobe = (map) => {
  const { userInteracting, spinEnabled } = this.state

  if (spinEnabled && !userInteracting) {
    let distancePerSecond = 360 / secondsPerRevolution;
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
}
```

`secondsPerRevolution` 控制轉動速度（每兩分鐘轉動一圈），
如果地球現在處於轉動而且使用者沒有在進行互動，透過不斷改變中心點的經度讓地球進行轉動，用 `easeTo` 做動畫的過渡，這樣視覺看起來就很像地球一直在轉一樣～

### 4. 事件觸發
透過 Event 來控制呼叫 `spinGlobe()` 的時機～

```jsx=
componentDidMount() {
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
```

簡單解釋一下這段：在點擊地圖的當下，`userInteracting`（使用者進行互動）設為 `true`；在按下滑鼠放開後，再把 `userInteracting` 關閉，並呼叫 `spinGlobe()` 讓地球不要轉動，在下次的移動時就會再次呼叫 `spinGlobe()`，地球就會轉動了！

所以如果你點了地圖一下，地球就會停止轉動，等到你拖動一下地圖它才會繼續轉喔～

完成以上，你就會獲得一張自轉的地球 3D 地圖：

![](https://i.imgur.com/I8evgUi.jpg)

真的很酷吧！

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Global)


大家對於地圖的第一印象大多都是平面 2D 的那種，如果設計上再加入類似這樣的 3D 設計，真的會讓人覺得很新奇～

明天沿用今天的範例，來帶大家去看富士山！（欸？

## Reference
- [Create a rotating globe](https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/)
- [Globe and Atmosphere](https://docs.mapbox.com/mapbox-gl-js/guides/globe/)
