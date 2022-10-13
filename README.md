###### tags: `ithome` `ironman`
# Day 29 - 一些很酷的 Mapbox Styles～(5)

最後一篇技術分享！
這系列的文章我們都在介紹陸地上的東西，最後一篇看關於海洋的部分吧～

我們最常拿大海的深度來做界線分類對吧，像是淺水區深海區之類的，今天來做一張可以分辨出海洋深淺區域的地圖，用顏色來做視覺化的效果～

## 地圖初始化
首先，第一步還是來為初始化的部分做設定：

```jsx=
constructor(props) {
  super(props);
  this.state = { 
    lng: 120,
    lat: 23.5,
    zoom: 1.5,
  };
  this.mapContainer = React.createRef();
}

componentDidMount() {
  const { lng, lat, zoom } = this.state;
  const map = new mapboxgl.Map ({
    container: this.mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom,
  });
}
```

## 加入圖層
接下來，加入海洋深度的圖層吧：

```jsx=
map.on('load', () => {
  map.addSource('bathymetry', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-bathymetry-v2'
  });
  
  map.addLayer({
    'id': 'water-depth',
    'type': 'fill',
    'source': 'bathymetry',
    'source-layer': 'depth',
    'layout': {},
    'paint': {
      'fill-color': [
        'interpolate',
        ['cubic-bezier', 0, 0.5, 1, 0.5],
        ['get', 'min_depth'],
        200,
        '#78bced',
        9000,
        '#15659f'
      ]
    }
  }, 'hillshade');
})
```

資料來源我們拿官網提供的～(耶)
透過 `interpolate` 做深淺水區的顏色差別，再用 `hillshade` 做陰影的部分。

到這邊，你就會得到一張平面的海洋地圖了：

![](https://i.imgur.com/WEB2581.png)

有點像用水彩幫海洋上色的感覺 XDD

## 變成 3D 地球型態吧！
平面圖真的太普通了，就是缺少一點立體感 ...
所以，我們把它變成 3D 球體的地圖吧～ (沒綽，我真的覺得立體地球很酷啦)

作法超級簡單，在初始化的時候加上設定就好：

```jsx=
const map = new mapboxgl.Map ({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [lng, lat],
  zoom: zoom,
  projection: 'globe'
});
```

然後再加上宇宙的背景圖：

```jsx=
map.on('style.load', () => {
  map.setFog({});
})
```

來看一下成果～

![](https://i.imgur.com/aypKtY4.png)

立體特效實在是大大加分對吧 (⁎⁍̴̛ᴗ⁍̴̛⁎)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Ocean)


終於完成這一系列的分享文了 ... 明天交上 300 字心得分享哈哈
(不要說太多，怕明天沒有字數湊)

## Reference
- [Style ocean depth data](https://docs.mapbox.com/mapbox-gl-js/example/dancing-buildings/)
- [interpolate｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#interpolate)
