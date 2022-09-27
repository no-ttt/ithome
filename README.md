###### tags: `ithome` `ironman`
# Day 11 - Camera：地圖相機位置由你決定！

說是相機位置可能會有點抽象 (對！我就是直接英翻中的，標題真難下)
其實就是使用者在地圖的第一視角位置啦～

Mapbox 對於 Camera 提供了以下功能：
- 可以設置、調整相機位置
- 監聽相機變化
- 獲取相機位置
- 限制相機位置以設置邊界

除了單純的控制地圖視點位置，在 Camera 更改為新值時，Mapbox 也有提供過度動畫可以使用，增加使用者體驗！

那我們分為相機位置和動畫來做介紹～開始吧

## 相機位置
常用的相機位置可以大致分成：Center, Zoom, Bearing, Pitch，官網有放一張動畫我覺得解釋的很清楚，分享一下～ [傳送門](https://docs.mapbox.com/android/maps/guides/camera-and-animation/camera/)

![](https://i.imgur.com/Yl8Sin6.png)

大致清楚名詞定義後，接下來我們針對這些類別介紹有哪些應用！

### Center
- `getCenter()`：回傳地圖的中心位置
- `setCenter(center, eventData)`：設置地圖的中心位置

> ex. 取得地圖中心位置：

```jsx=
// Return a LngLat object such as {lng: 0, lat: 0}.
const center = map.getCenter();
// Access longitude and latitude values directly.
const {lng, lat} = map.getCenter();
```

### Zoom
- `getZoom()`：回傳 zoom level
- `setZoom(zoom, eventData)`：設置 zoom level
- `zoomTo(zoom, options, eventData)`：將地圖縮放到指定的 zoom level (帶有過渡動畫)
    - `duration`：過度持續時間 (毫秒)
    - `offset`：經緯度偏差值

> ex. 設置是否帶有動畫：

```jsx=
// Zoom to the zoom level 5 without an animated transition
map.zoomTo(5);

// Zoom to the zoom level 8 with an animated transition
map.zoomTo(8, {
  duration: 2000,
  offset: [100, 50]
});
```

- `zoomIn(options, eventData)`：縮放層級提高 1 個層級
- `zoomOut(options, eventData)`：降低縮放層級 1 個層級

### Bearing
- `getBearing()`：回傳地圖旋轉角度
- `setBearing(bearing, eventData)`：設置地圖旋轉角度

> ex. 將地圖旋轉 90 度：

```jsx=
// Rotate the map to 90 degrees.
map.setBearing(90);
```

### Pan
- `panBy(offset, options, eventData)`：按指定的偏移量平移地圖
- `panTo(lnglat, options, eventData)`：使用動畫過渡將地圖平移到指定位置

> ex. 地圖平移到指定位置：

```jsx=
map.panTo([121, 24], {duration: 5000});
```

### Pitch
- `getPitch()`：回傳地圖傾斜角度
- `setPitch(pitch, eventData)`：設置地圖傾斜角度

> ex. 將地圖傾斜 40 度：

```jsx=
map.setPitch(80);
```

在設定上，除了可以用 `set` 去控制，也可以在初始化地圖的時候就先設置好～
> ex. 地圖傾斜 45 度：

```jsx=
const map = new mapboxgl.Map ({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [lng, lat],
  zoom: zoom,
  pitch: 45,
});
```

> 輸出地圖：

![](https://i.imgur.com/iNd3yje.png)


今天就是介紹一些地圖視角的名詞跟應用，使用上蠻單純的就不帶上範例程式了～
下一篇來說一下關於動畫呈現以及和 Camera 相關的 Event，應該會有趣一點 XDDD


## Reference
- [Camera and animations](https://docs.mapbox.com/android/maps/guides/camera-and-animation/)
- [Camera｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#instance-members-camera)

----------
# Day 12 - Camera (2)：為轉換視角加上過渡動畫

知道如何控制視角位置後，今天我們來替這個過程加上過渡動畫！
那在 Camera 的部分也是有相關的 Event 可以使用，一起來用抗抗吧～ 

(其實我也是昨天在打鐵人賽找文章的時候才發現的（￣□￣；）)

## 過渡動畫
雖然我列了 3 個，但有過渡動畫的只有 `easeTo` 和 `flyTo`，它們很像彼此的進化體所以就一起介紹了～ ~~絕對不是因為強迫症~~

> 這邊統一以 A 點代表舊位置，B 點代表新的位置說明

- `jumpTo(options, eventData)`：沒有過渡動畫，從 A 跳到 B (就是這麼白話)
- `easeTo(options, eventData)`：有過渡動畫，從 A 移動到 B
- `flyTo(options, eventData)`：有過渡動畫，從 A 以飛行的曲線動畫過渡到 B

> ex. 從預設經緯度飛到指定經緯度並做縮放：

```jsx=
map.flyTo({
  center: [120, 23.5],
  zoom: 9,
});
```

通常我都使用 `flyTo` 去做過渡，有曲線動畫真的舒服很多！(不信可以去試試看啦)

## Event
跟 Camera 有關的事件不多，既然不多就可以稍微放上來介紹一下了 :D

- `pitchstart`：地圖傾斜時觸發
- `pitch`：地圖傾斜的過渡期間觸發
- `pitchend`：地圖傾斜後觸發

> ex. 地圖發生傾斜後，跳出小視窗：

```jsx=
map.on('pitchend', () => {
  alert('A pitchend event occurred.');
});
```

## Application
Camera 介紹到這邊，來動手做吧！
在官網看到一個很酷的範例，拿來修改了一下：

> ex. 利用鍵盤的上下左右控件導航地圖

```jsx=
const map = new mapboxgl.Map ({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [lng, lat],
  zoom: zoom,
  bearing: 12,
  pitch: 60, 
  interactive: false
});

// pixels the map pans when the up or down arrow is clicked
const deltaDistance = 100;

// degrees the map rotates when the left or right arrow is clicked
const deltaDegrees = 25;  

map.on('load', () => {
  map.getCanvas().focus();

  map.getCanvas().addEventListener(
    'keydown',
    (e) => {
      e.preventDefault();
      if (e.which === 38)                         // up
        map.panBy([0, -deltaDistance])
      else if (e.which === 40)                    // down
        map.panBy([0, deltaDistance])
      else if (e.which === 37)                    // left
        map.easeTo({
          bearing: map.getBearing() - deltaDegrees,
        })
      else if (e.which === 39)                    // right
        map.easeTo({
          bearing: map.getBearing() + deltaDegrees,
        })
    },  
    true
  );
});
```

稍微解釋一下這段 code 在做什麼：
1. 在初始化地圖的時候設定好預設的視角，並把 `interactive` 關掉 (就是你用滑鼠點地圖還幹嘛的 Mapbox 都不會理你)
2. `deltaDistance` 和 `deltaDegrees` 設置好每次移動或轉動的值
3. `getCanvas` 獲取地圖元素，並給予焦點 (`focus()`) 和監聽 (`addEventListener`)
4. 監聽「上下左右」鍵，並做相應的反應
    - 上、下：平移地圖 (`panBy`)
    - 左、右：旋轉地圖 (`bearing`)，並用 `easeTo` 做過渡效果

> 地圖輸出：

![](https://i.imgur.com/vVf0u9s.png)

移動的話在自己去玩看看嘍～

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Camera)


看起來要過第二個禮拜了，趁現在告一個小段落所以明天來做一個小 Demo，雖然我還沒想到要做些什麼哈哈 ... 

應該不會開天窗吧 ...( ´•̥̥̥ω•̥̥̥` )


## Reference
- [Navigate the map with game-like controls](https://docs.mapbox.com/mapbox-gl-js/example/game-controls/)
- [Camera｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#instance-members-camera)
- [Event｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map.event:zoomstart)
- [getCanvas｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#getcanvas-returns)
