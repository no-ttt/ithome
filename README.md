###### tags: `ithome` `ironman`
# Day 09 - Events (2)：Lifecycle

今天來介紹第二個關於 Event 的應用，「Lifecycle」生命週期～
跟 React 的生命週期是一樣的概念，主要是在控制地圖渲染的時機，舉個例子：我希望在每次重新呼叫 API 的時候，地圖都可以重新整理一次做更新，那這個時候就會用到生命週期的概念了！

來看一下關於生命週期的常見 Event 有哪些～

## Lifecycle
- `load`：在所有必要資源下載完，地圖的第一次渲染後觸發
- `render`：每次地圖的重新渲染就會觸發，ex.
    - 地圖位置、縮放、方位等
    - 地圖樣式
    - GeoJSON
    - loading ...
- `idle`：在地圖進入「空閒」狀態的最後一刻觸發，ex.
    - 當前所有請求都加載完畢
    - 所有過渡動畫都完成
- `error`：發生錯誤時觸發，Mapbox GL JS 的主要錯誤報告機制
    - 若沒有綁定 `error` 事件，錯誤資訊會出現在控制台 (console)


常見的生命週期大概就這些，那來帶個使用範例～
大家對 `idle` 的使用應該會比較抽象，就用 `idle` 來寫個例子：
> ex. 每次地圖閒置前會更新 Popup

```jsx=
let count = 0;
map.on('idle', () => {
  console.log('A idle event occurred.');
  count > 0 &&
  new mapboxgl.Popup({
    closeOnMove: true
  })
    .setLngLat([121, 23.5])
    .setHTML(`<h1>count: ${count}</h1>`)
    .addTo(map);
  count += 1;
});
```

我用 `count` 來計每次的重新渲染次數，在首次地圖渲染 (`count` = 0) 時，彈跳窗並不會出現；並將 `Popup` 的 `closeOnMove` 設為 `true`，只要移動到地圖，彈跳窗就會被關閉，這樣更能看得到 `idle` 所產生的變化：每次地圖重新渲染到進入空閒期前一刻，彈跳窗就會出現並且顯示 `count` 的次數。

![](https://i.imgur.com/fh19hwo.png)

上述介紹有說到，如果沒有特別寫 `error` 的話，錯誤訊息只會出現在主控台，為了有更好的使用者體驗，或許可以再加入 `error` 事件：
> ex. 地圖發生錯誤時，跑出提示小視窗

```jsx=
map.on('error', () => {
  alert('A error event occurred.');
});
```

![](https://i.imgur.com/4XVPNvu.png)

我寫得較為簡陋，可以依據需求自行調整～

[Gtihub 完整程式碼](https://github.com/no-ttt/ithome/tree/Lifecycle)


關於生命週期這篇其實蠻重要的，在很多情況下我們會用上它！(真 D 好用) 
明天介紹最後一篇 Event 事件，假日過得好快嗚嗚嗚 ...


## Reference
- [Events-Lifecycle｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#events-lifecycle)
