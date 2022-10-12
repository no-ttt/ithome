###### tags: `ithome` `ironman`
# Day 27 - 一些很酷的 Mapbox Styles～(3)

還記得我在 [Day 04 - 在地圖上標記 Marker](https://ithelp.ithome.com.tw/articles/10294406) 的時候寫了一篇地圖的 `Marker` 教學嗎～
其實標點不限於常見的 2D 地圖喔，3D 的也可以！
我們今天就來看一下怎麼在 3D 地圖上進行標記地點～

前置作業因為我們前幾篇有講過所以這邊就不再說明了，想看怎麼弄出一顆 3D 地球可以看這篇 [Day 25 - 一些很酷的 Mapbox Styles～(1)](https://ithelp.ithome.com.tw/articles/10307113)。

不過地球的樣式我有做更換啦，官網範例的這個樣式我看了很喜歡 (⁎⁍̴̛ᴗ⁍̴̛⁎)
(往下滑看效果！)

## 客製化的 Icon
圖示的部分是透過 css 的 `background-image` 所引入的，然後再加上一些視覺效果：

```css=
.marker {
  background-image: url('https://docs.mapbox.com/mapbox-gl-js/assets/pin.svg');
  background-size: cover;
  cursor: pointer;
}
```

## 標記一個 Marker 到地球上
要在 3D 地圖上作標記其實跟我們之前所介紹的客製化 Marker 的做法很像，都是透過 `createElement` 來實作，廢話不多說直接上 code：

```jsx=
const el = document.createElement('div');
  el.className = 'marker';
  const size = 80;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

new mapboxgl.Marker({
  element: el,
  rotationAlignment: 'horizon',
  offset: [0, -size / 2]
})
  .setLngLat([121, 23.5])
  .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h1>Taiwan</h1>`)
  )
  .addTo(map);
```

這邊解釋一下 `rotationAlignment` 的用途，他是可以讓 Marker 可以貼齊在地平線上的屬性，就是可以讓你看起來 Marker 就像直接插在地球這個球體上的視覺感啦～

其他用法就跟之前介紹的 Custom Marker 沒什麼不一樣，沒參與到的可以看一下[這裡](https://ithelp.ithome.com.tw/articles/10294406)！

那麼到這裡，你就會有一張有標記台灣位置的 3D 地球了，並且點擊 Marker 會有彈跳窗跑出來：

![](https://i.imgur.com/HhXGARP.png)

白色的地球真的很美的對吧～

## 標記多個 Marker
接下來，我們就來標記更多的 Marker，我們先把要標記的這些地區資料整理好：

```jsx=
const allLoc = [
  {
    "name": "Taiwan",
    "coordinates": [121, 23.5]
  }, 
  {
    "name": "Japan",
    "coordinates": [136.88464720797114, 35.19787221331142]
  },
  {
    "name": "Los Angeles",
    "coordinates": [-118.2436849000, 34.0522342000]
  },
  {
    "name": "London",
    "coordinates": [1.1743, 52.3555]
  },
  {
    "name": "Russia",
    "coordinates": [37.5, 55.5]
  },
  {
    "name": "Sri Lanka",
    "coordinates": [80.45, 7.57]
  },
]
```

然後再利用迴圈把所有的點都標記到地圖上：

```jsx=
for (const loc of allLoc) {
  const el = document.createElement('div');
  el.className = 'marker';
  const size = 80;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

  new mapboxgl.Marker({
    element: el,
    rotationAlignment: 'horizon',
    offset: [0, -size / 2]
  })
    .setLngLat(loc.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
      .setHTML(`<h1>${loc.name}</h1>`)
    )
    .addTo(map);
}
```

> 地圖輸出：

![](https://i.imgur.com/5MiN9kA.png)

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Global_Marker)


突然發現到目前為止的分享篇好像都在介紹立體地球 XD
所以！明天來換換口味，做點不一樣的東西好了～
不過立體地球真的挺酷的對吧～(白色地球還很漂亮欸！)


## Reference
- [Orient markers toward the horizon](https://docs.mapbox.com/mapbox-gl-js/example/marker-horizon-aligned/)
- [Markers｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker)
