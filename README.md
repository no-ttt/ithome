###### tags: `ithome` `ironman`
# Day 04 - 在地圖上標記 Marker

一起在地圖上進行標記吧！
在地圖上加上很多 Marker 好像就做完一半的 Project 了...？（絕對是視覺影響判斷)

我們把 Marker 分為 2 種，一個是常常在地圖看到的
這種 Marker ![](https://i.imgur.com/M6vVplT.png) (Default)
另一種就是使用者依照需求自定義的標記圖像。
無論是哪種 Marker，能在地圖上標點的就是好 Marker，所以我們都要來介紹！


> Marker :

```
new Marker(options: Object?, legacyOptions: Options?)
```

## Default Marker
其實 Mapbox 的 Default Marker 是藍色的，不過我覺得紅色比較親切所以放紅色的哈～

好的進入正題，要加入 Default Marker 非常簡單 (端上程式碼)

```jsx=
// Create a new marker.
const marker = new mapboxgl.Marker()
  .setLngLat([121, 23.5])
  .addTo(map);
```

`setLngLat` 代表所設置的經緯度。
然後你就會得到一張帶有標記地點的台灣地圖～

![](https://i.imgur.com/j3I4vJL.png)

如果想換個顏色，就新增一個 `Option` 並在 `color` 帶入想要的色號：

```jsx=
const marker = new mapboxgl.Marker({
  color: "pink",
})
  .setLngLat([121, 23.5])
  .addTo(map);
```

:::info
#### 其他常見的 Option 使用：
- `draggable`：是否能拖移 (boolean)
- `rotation`：旋轉角度 (number)
- `scale`：比例大小 (number)

更多其他功能可以看官網給的 [Parameters]([Marker](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker)) 表格～
:::

## Custom Marker
建立自定義的標記圖像的概念有點像是先創造一個 DOM element，再利用 css 去做它的外觀，最後把這個變數放到 `Marker` 的 `Object` 位置。除此之外，其他的使用方式跟 Default Marker 其實是一樣的！

```jsx=
// Create a DOM element for each marker.
const el = document.createElement('div');
const width = 40;
const height = 40;
el.className = 'marker';
el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
el.style.width = `${width}px`;
el.style.height = `${height}px`;
el.style.backgroundSize = '100%';

// Add markers to the map.
new mapboxgl.Marker(el)
  .setLngLat([121, 23.5])
  .addTo(map);
```

之後你就會在你的地圖上看到一隻可愛貓貓 (⁎⁍̴̛ᴗ⁍̴̛⁎)

![](https://i.imgur.com/L8SeE6u.png)

:bulb: 在這邊你就會聯想到，如果我希望在地圖上標記的是 Button 而不是 Marker，就可以在 `createElement` 的時候直接建立 `button` 的 element 了！
沒綽！這個寫法要做變化真的超級好用，趕緊記下來～

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Marker)


在地圖添加標記還有個方法，那就是建立 Symbol Layer，這個在之後說到 Layer 的時候會來介紹所以就先暫時不提了！(絕對不是我還不熟悉怎麼用 ><)


## Reference
- [Marker｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker)
- [Add custom icons with Markers](https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/)
