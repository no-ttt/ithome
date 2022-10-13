###### tags: `ithome` `ironman`
# Day 28 - 一些很酷的 Mapbox Styles～(4)

Mapbox 除了可以支援我們一般常在用的 2D 地圖，還有我們前幾天介紹的 3D 立體地球跟地形外貌以外，還可以用 3D 形式呈現建築物高度喔～

有點像積木狀的地圖，像這樣：

![](https://i.imgur.com/bkSTHsn.png)

那我們今天就以這個主題地圖，來看 101 大樓會到底會長怎麽樣！

## 地圖初始化
老樣子，一開始我們先設定一下地圖的初始值：

```jsx=
const map = new mapboxgl.Map ({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/light-v10',
  lng: 121.56471200641218,
  lat:25.033808911641213,
  zoom: 15.8,
  pitch: 45,
  bearing: -17.6,
  antialias: true
});
```

還特別去查了一下 101 大樓的經緯度 XDDD

## 加入圖層
再來就是加入建築物高度的圖層：

```jsx=
map.addLayer(
  {
    'id': 'add-3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
    }
  }
);
```

- `fill-extrusion`：關於顯示 3D 建築物高度的圖層（Layer 的其中一種，只是我們之前沒有介紹過）
- `fill-extrusion-color`：建築物顏色
- `fill-extrusion-height`：建築物高度
- `fill-extrusion-base'`：建築物底座
- `fill-extrusion-opacity`：建築物顏色的透明度


完成上面這些設定後，執行你的專案你就會看到 101 出現了：

![](https://i.imgur.com/YwxehW9.png)

跟我想像中的不太一樣，看起來有點弱弱的 ...

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Building)


這系列的文章快結束了（剩下兩天！！）
過程真的蠻煎熬的，現在快結束了心情更煎熬哈哈 ...
像是我還沒想好明天要分享什麼這件事 :D

但能確定的是，最後一篇絕對是分享我這 30 天的心得～



## Reference
- [Display buildings in 3D](https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/)
- [fill-extrusion｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#fill-extrusion)
