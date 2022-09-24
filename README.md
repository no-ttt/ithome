###### tags: `ithome` `ironman`
# Day 10 - Events (3)：Movement

最後一個 Event 我們來介紹在地圖上所做的一些「動作」～
這邊說的動作是指像是對地圖進行移動、拖拉、旋轉、放大縮小等等，像點擊、懸停那些是歸類在互動 (Interaction) 喔！

來看看常用到的 Movement 有哪些～

## Movement
- `movestart`：地圖移動前
    - 常與 `jumpTo` 搭配使用
- `move`：地圖移動時的過渡期間
    - 常與 `flyTo` 搭配使用
- `moveend`：地圖移動後
    - 常與 `jumpTo` 搭配使用
- `dragstart`：拖動平移前
- `drag`：拖動平移的過渡期間
- `dragend`：拖動平移後
- `zoomstart`：地圖從一個縮放級別轉換到另一個縮放級別之前
    - 常與 `flyTo` 搭配使用
- `zoom`：地圖從一個縮放級別轉換到另一個縮放級別的過渡期間
    - 常與 `flyTo` 搭配使用
- `zoomend`：地圖從一個縮放級別轉換到另一個縮放級別之後
    - 常與 `flyTo` 搭配使用

`flyTo` 跟 `jumpTo` 在下一篇會來做介紹，可以看到常用的動作主要是在移動 (move)、拖拉 (drag) 和縮放 (zoom) 的應用上，那如果對其他有興趣的可以到官網看一下～

一樣的，介紹完後來帶一個使用範例：
> ex. 拖動 Marker 並且在放下之後跳出小視窗，顯示所在經緯度

```jsx=
const marker = new mapboxgl.Marker({
  color: "pink",
  draggable: true,
})
  .setLngLat([121, 23.5])
  .addTo(map);

marker.on('dragend', () => {
  alert(`You put me down at:
      Longitude: ${marker.getLngLat().lng}
      Latitude: ${marker.getLngLat().lat}`
  );
});
```

我們先把 `marker` 設為可拖移的 (`draggable`: `true`)，並在 `marker` 加上觸發 Event 的條件：放下拖動的 `marker` 後顯示經緯度 (`getLngLat`)

![](https://i.imgur.com/qp8SVAE.png)

耶～完成！


關於 Event 的部分到這邊先告一個段落了，在寫的過程中突然發現我竟然忘記介紹 Camera !!!
於是愉快的決定好明天的主題啦哈哈 ( ˶ｰ̀֊ｰ́ )੭”


[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Movement)

## Reference
- [Events-Movement｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#events-movement)
- [Create a draggable Marker](https://docs.mapbox.com/mapbox-gl-js/example/drag-a-marker/)
- [Events and event types](https://docs.mapbox.com/mapbox-gl-js/api/events/#mapwheelevent)
