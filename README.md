###### tags: `ithome` `ironman`
# Day 05 - 關於一些 Control

今天來說一下常用的控制元件！ (就是地圖上的小工具啦)
預設地圖是長這樣的：

![](https://i.imgur.com/4gnjc3p.jpg)

對的沒錯，這些小工具需要我們寫程式來把它們呼叫出來...
我們使用 `addControl` 來將小工具添加到地圖上～

這邊主要介紹的 Control 有：
- 地圖的歸屬信息
- 全頻模式切換
- 瀏覽器定位
- 地圖縮放和指南針

廢話不多說，開始吧！

## 地圖的歸屬信息
> AttributionControl :
```
new AttributionControl(options: Object?)
```

地圖的歸屬信息：標示出地圖資料來源的信息，預設位置在地圖的右下角。

(端上程式碼)

```jsx=
const map = new mapboxgl.Map({
  container: this.mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [lng, lat],
  zoom: zoom,
  attributionControl: false,
})
  .addControl(new mapboxgl.AttributionControl({
    customAttribution: 'Map design by me'
  }));
```

我們先透過 `attributionControl` 將原本的「出處 Mapbox」 的信息關掉，再透過 `addControl` 新增一個我們自己的來源信息 (`customAttribution`)，看一下輸出地圖：

![](https://i.imgur.com/3i1MZmi.png)

這裡看一下如果沒有將 `attributionControl` 設為 `false` 的情況：

![](https://i.imgur.com/Qxm1qd4.png)

所以還是要記得關掉喔！

## 全頻模式切換
> FullscreenControl：
```
new FullscreenControl(options: Object?)
```

全頻模式：全螢幕模式，預設位置在地圖的右上角。

![](https://i.imgur.com/gi997If.png) (長這樣)

```jsx=
map.addControl(new mapboxgl.FullscreenControl());
```

## 瀏覽器定位
> GeolocateControl：
```
new GeolocateControl(options: Object?)
```

瀏覽器定位：就是使用者定位，預設位置在地圖的右上角，它是利用瀏覽器定位去找到使用者的位置，但是！**不是所有瀏覽器都支持地理定位的**，有些用戶還會禁用這個功能，那在定位不到使用者位置時，`GeolocateControl` 就會顯示禁用。 

![](https://i.imgur.com/fhiz78Z.png) (像這樣)

```jsx=
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}));
```

- 參數意義
    - `trackUserLocation` : 自動追蹤使用者移動，若為 `false` 則只有在使用者再次按下定位按鈕才會進行位置的更新
    - `showUserHeading`：使用者的設備方向 (在用戶位置點旁邊會有個箭頭)
    - `showUserLocation`：是否要顯示使用者位置

## 地圖縮放和指南針
> NavigationControl：
```
new NavigationControl(options: Object?)
```

地圖縮放：控制地圖縮放大小，預設位置在地圖的右上角。

![](https://i.imgur.com/Jp3u8VG.png) (長這樣)

```jsx=
map.addControl(new mapboxgl.NavigationControl());
```

那如果我只想放地圖縮放或是指南針一個功能而已，就只要把另一個關掉就行了：
> ex. 拿掉指南針

```jsx=
map.addControl(new mapboxgl.NavigationControl({
  showCompass: false,
  // showZoom: false, // remove showZoom
}));
```

## 小工具擺放位置
上面介紹的小工具位置也是可以做更改的，那就是透過 `addControl`！

> addControl：

```
addControl(control, position?)
```

沒綽！就是在 `addControl` 的後面加上位置資訊就可以了！
這邊帶一個範例程式碼：
```jsx=
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
```
就是這麼簡單，試試看吧～

[Github 完整程式碼](https://github.com/no-ttt/ithome/tree/Control)


一些常見的地圖小工具就介紹到這～
可加可不加，就看你的主題功能需求了，明天來寫一下彈跳窗！

掰 - -

## Reference
- [Controls｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/markers/#attributioncontrol)
- [addControl｜Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addcontrol)
