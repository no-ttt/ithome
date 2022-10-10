###### tags: `ithome` `ironman`
# Day 26 - 一些很酷的 Mapbox Styles～(2)

今天帶大家去日本看富士山吧～？
不過是地圖版的啦，我也好想去日本玩 ༼இɷஇ༽

程式碼我們沿用上一篇的 3D 地球地圖來繼續做，不清楚的可以點擊[這裡](https://ithelp.ithome.com.tw/articles/10307113)！

## 3D 地形圖
首先，我們先來看一下要怎麼讓地圖呈現出 3D 地形樣貌！
Mapbox 有提供一個叫 `raster-dem` 的 `source` 可以用，讓我們可以輕鬆地做出地形圖；在使用上，它也有一些參數可以進行調整，有興趣的可以到官網逛逛～([傳送門](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#raster-dem))

使用方法如下：

```jsx=
map.addSource('mapbox-dem', {
  'type': 'raster-dem',
  'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
  'tileSize': 512,
  'maxzoom': 14
});
```

`tileSize` 指的是圖層的最小視覺尺寸，`maxzoom` 是最大縮放層級～

那接下來我們用 `setTerrain` 來設置地形屬性的圖層：

```jsx=
map.setTerrain({
  'source': 'mapbox-dem',
  'exaggeration': 1.5
});
```

`exaggeration` 是指地形高度的誇張程度 (抱歉比較口語化了一點 XDD)。

## 一起去看富士山吧！
最後就是「飛」去富士山這件事要解決了！
我們放個按鈕到地圖上，點擊按鈕 Mapbox 就會帶我們去日本了～
當然，這是比較簡 (偷) 陋 (懶) 的做法 ...
```htmlmixed=
<button id="fly" onClick={this.flyTo}>Fly</button>
```

然後再寫一個 `flyTo` 的 Function 來控制觸發事件後要做的事：
```jsx=
flyTo = () => {
  const { map } = this.state
  this.setState({ spinEnabled: false })
    
  map.flyTo({
    center: [138.7186086, 35.3606247],
    zoom: 12,
    duration: 10000,
    essential: true,
    pitch: 75
  });
}
```

`spinEnabled` 設置為 `false` 讓地球停止轉動，然後再飛到富士山～
記得要設 `pitch` 的傾斜角度，不然我們看的角度會是由上往下，就不能清楚的看到地形圖了！
(富士山會變成扁的 XD)

完成！現在你只要點擊畫面上的按鈕，地球就會轉到日本那面並且帶你飛到富士山：

![](https://i.imgur.com/1MkIABs.jpg)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Global_Fuji)


Mapbox 真的蠻強大的，竟然連地形圖都有～
而且還很好上手，在地圖的使用上又多了一種選擇！

## Reference
- [Slowly fly to a location](https://docs.mapbox.com/mapbox-gl-js/example/flyto-options/)
- [Add 3D terrain to a map](https://docs.mapbox.com/mapbox-gl-js/example/add-terrain/)
- [raster-dem｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#raster-dem)
- [setTerrain｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#setterrain)
